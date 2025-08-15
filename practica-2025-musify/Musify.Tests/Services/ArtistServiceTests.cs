using Application.Contracts;
using Application.Exceptions;
using Application.UseCases;
using Domain.Entities;
using Moq;
using Xunit;


namespace Musify.Tests.Services
    {
        public class ArtistServiceTests
        {
            private readonly Mock<IArtistRepository> _repoMock;
            private readonly ArtistService _service;

            public ArtistServiceTests()
            {
                _repoMock = RepositoryMock.GetArtistMock();
                _service = new ArtistService(_repoMock.Object);
            }

            [Fact]
            public async Task Should_Output_All_Artists()
            {
                var result = await _service.GetAll();

                Assert.NotNull(result);
                Assert.Equal(3, result.Count());
            }

            [Fact]
            public async Task Should_Output_All_Person_Type_Artists()
            {
                var result = await _service.GetAllArtists();

                Assert.NotNull(result);
                Assert.All(result, a => Assert.Equal("person", a.Type));
            }

            [Fact]
            public async Task Should_Output_All_Bands()
            {
                var result = await _service.GetAllBands();

                Assert.NotNull(result);
                Assert.All(result, a => Assert.Equal("band", a.Type));
            }

            [Fact]
            public async Task Should_Return_Artist_For_Given_Id()
            {
                var result = await _service.GetArtistById(1);

                Assert.NotNull(result);
                Assert.Equal("John", result.FirstName);
            }

            [Fact]
            public async Task Should_Throw_Exception_If_Artist_Not_Found_By_Id()
            {
                var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.GetArtistById(999));
                Assert.Equal("Artist not found", ex.Message);
            }

            [Fact]
            public async Task Should_Add_Artist_If_Valid()
            {
                var newArtist = new Artists
                {
                    Id = 4,
                    FirstName = "Alice",
                    LastName = "Wonder",
                    Type = "person"
                };

                await _service.AddArtist(newArtist);

                _repoMock.Verify(r => r.AddArtist(It.Is<Artists>(a => a.Id == 4)), Times.Once);
            }

            [Fact]
            public async Task Should_Throw_Exception_If_Artist_Null_On_Add()
            {
                var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.AddArtist(null!));
                Assert.Equal("Artist is null", ex.Message);
            }

            [Fact]
            public async Task Should_Update_Artist_If_Valid()
            {
                var update = new Artists
                {
                    Id = 1,
                    Type = "person",
                    StageName = "John Updated",
                    ActiveStart = DateTime.Now
                };

                await _service.UpdateArtist(update);

                _repoMock.Verify(r => r.UpdateArtist(It.Is<Artists>(a => a.StageName == "John Updated")), Times.Once);
            }

            [Fact]
            public async Task Should_Throw_Exception_If_Type_Mismatch_On_Update()
            {
                var update = new Artists
                {
                    Id = 2,
                    Type = "person"
                };

                var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.UpdateArtist(update));
                Assert.Equal("Artist found doesn't match type", ex.Message);
            }

            [Fact]
            public async Task Should_Delete_Artist_If_Valid()
            {
                var artist = new Artists { Id = 3 };

                await _service.DeleteArtist(artist);

                _repoMock.Verify(r => r.DeleteArtist(It.Is<Artists>(a => a.Id == 3)), Times.Once);
            }

            [Fact]
            public async Task Should_Throw_Exception_If_Artist_Null_On_Delete()
            {
                var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.DeleteArtist(null!));
                Assert.Equal("Artist is null", ex.Message);
            }

            [Fact]
            public async Task Should_Add_Band_Member_If_Valid()
            {
                var band = new Artists { Id = 2, Type = "band" };
                var member = new Artists { Id = 1, Type = "person" };

                await _service.AddBandMember(band, member);

                _repoMock.Verify(r => r.AddBandMember(band, member), Times.Once);
            }

            [Fact]
            public async Task Should_Throw_Exception_If_Band_Or_Member_Null_On_Add()
            {
                var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.AddBandMember(null!, null!));
                Assert.Equal("Artist-person or Artist-band is null", ex.Message);
            }

            [Fact]
            public async Task Should_Search_Artists_By_Name()
            {
                var result = await _service.Search("JD");

                Assert.NotNull(result);
                Assert.Single(result);
                Assert.Equal("JD", result.First().StageName);
            }
        }
}
