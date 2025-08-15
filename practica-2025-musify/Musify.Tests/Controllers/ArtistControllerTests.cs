using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Musify.Controllers;
using Musify.DTOs.ArtistDTOs;
using Xunit;

namespace Musify.Tests.Controllers
{
    public class ArtistControllerTests
    {
        private readonly Mock<IArtistService> _mockService;
        private readonly ArtistController _controller;

        public ArtistControllerTests()
        {
            _mockService = GetArtistServiceMock();
            _controller = new ArtistController(_mockService.Object);
        }

        private static Mock<IArtistService> GetArtistServiceMock()
        {
            var seededArtists = new List<Artists>
            {
                new Artists
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    StageName = "JD",
                    Type = "person",
                    ActiveStart = new DateTime(2010, 1, 1),
                    ActiveEnd = null
                },
                new Artists
                {
                    Id = 2,
                    BandName = "The Rockers",
                    Type = "band",
                    Location = "NY",
                    ActiveStart = new DateTime(2005, 1, 1),
                    ActiveEnd = null
                },
                new Artists
                {
                    Id = 3,
                    FirstName = "Emily",
                    LastName = "Stone",
                    StageName = "EmStone",
                    Type = "person",
                    ActiveStart = new DateTime(2012, 5, 1),
                    ActiveEnd = null
                }
            };

            var mock = new Mock<IArtistService>();

            mock.Setup(s => s.GetArtistById(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededArtists.FirstOrDefault(a => a.Id == id));

            mock.Setup(s => s.GetArtist(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededArtists.FirstOrDefault(a => a.Id == id));

            mock.Setup(s => s.GetAll(It.IsAny<string>()))
                .ReturnsAsync((string type) =>
                    string.IsNullOrEmpty(type) ? seededArtists : seededArtists.Where(a => a.Type == type));

            mock.Setup(s => s.AddArtist(It.IsAny<Artists>()))
                .Returns(Task.CompletedTask);

            mock.Setup(s => s.UpdateArtist(It.IsAny<Artists>()))
                                .Returns<Artists>(artist =>
                                {
                                    var existingArtist = seededArtists.FirstOrDefault(a => a.Id == artist.Id);
                                    if (existingArtist != null)
                                    {
                                        existingArtist.FirstName = artist.FirstName;
                                        existingArtist.LastName = artist.LastName;
                                        existingArtist.StageName = artist.StageName;
                                        existingArtist.Type = artist.Type;
                                        existingArtist.ActiveStart = artist.ActiveStart;
                                        existingArtist.ActiveEnd = artist.ActiveEnd;
                                    }
                                    return Task.CompletedTask;
                                });

            mock.Setup(s => s.DeleteArtist(It.IsAny<Artists>()))
                .Returns(Task.CompletedTask);

            mock.Setup(s => s.Search(It.IsAny<string>()))
                .ReturnsAsync((string name) => seededArtists.Where(a =>
                    (a.FirstName != null && a.FirstName.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                    (a.LastName != null && a.LastName.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                    (a.StageName != null && a.StageName.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                    (a.BandName != null && a.BandName.Contains(name, StringComparison.OrdinalIgnoreCase))
                ));

            return mock;
        }

        [Fact]
        public async Task Should_Output_The_Artist_For_The_Given_Id()
        {
            var result = await _controller.GetArtistById(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var artist = Assert.IsType<Artists>(okResult.Value);
            Assert.Equal("John", artist.FirstName);
            Assert.Equal("JD", artist.StageName);
            Assert.Equal("person", artist.Type);
        }

        [Fact]
        public async Task Should_Return_NotFound_If_Artist_Does_Not_Exist()
        {
            var result = await _controller.GetArtistById(999);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task Should_Search_Artists_By_Name()
        {
            var result = await _controller.Search("Rockers");

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var artists = Assert.IsAssignableFrom<IEnumerable<Artists>>(okResult.Value);
            Assert.Single(artists);
            Assert.Equal("The Rockers", artists.First().BandName);
        }

        [Fact]
        public async Task Should_Create_Artist_When_Valid_Data_Is_Provided()
        {
            var newArtistDto = new ArtistDto
            {
                FirstName = "Alice",
                LastName = "Smith",
                StageName = "Ali",
                Type = "person",
                ActiveStart = new DateTime(2020, 1, 1),
                Birthday = DateTime.Now.AddYears(-30)
            };

            var result = await _controller.CreateArtist(newArtistDto);

            var okResult = Assert.IsType<OkResult>(result.Result);
            _mockService.Verify(s => s.AddArtist(It.IsAny<Artists>()), Times.Once);
        }

        [Fact]
        public async Task Should_Update_Artist_When_Valid_Data_Is_Provided()
        {
            var updateDto = new ArtistUpdateDto
            {
                Id = 1,
                StageName = "JD Updated",
                Type = "person",
                ActiveStart = new DateTime(2010, 1, 1)
            };

            var result = await _controller.UpdateArtist(updateDto);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var updatedArtist = Assert.IsType<Artists>(okResult.Value);
            Assert.Equal("JD Updated", updatedArtist.StageName);

            _mockService.Verify(s => s.UpdateArtist(It.IsAny<Artists>()), Times.Once);
        }

        [Fact]
        public async Task Should_Delete_Artist_When_Valid_Id_Is_Provided()
        {
            var artist = new Artists
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                Type = "person"
            };

            _mockService.Setup(s => s.GetArtist(It.IsAny<int>())).ReturnsAsync(artist);

            var result = await _controller.DeleteArtist(1);

            Assert.IsType<OkResult>(result);
            _mockService.Verify(s => s.DeleteArtist(It.IsAny<Artists>()), Times.Once);
        }

    }
}
