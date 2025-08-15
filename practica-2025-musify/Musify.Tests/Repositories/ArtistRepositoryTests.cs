using Application.Contracts;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Musify.Tests.Repositories
{
    public class ArtistRepositoryTests : IDisposable
    {
        private readonly MusifyDbContext _context;
        private readonly IArtistRepository _repository;

        public ArtistRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<MusifyDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new MusifyDbContext(options);
            _repository = new ArtistRepository(_context);

            SeedData().Wait();
        }

        private async Task SeedData()
        {
            var artist1 = new Artists
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                StageName = "JD",
                Type = "person"
            };

            var artist2 = new Artists
            {
                Id = 2,
                BandName = "The Rockers",
                Type = "band",
                Location = "NY"
            };

            var artist3 = new Artists
            {
                Id = 3,
                FirstName = "Jane",
                LastName = "Smith",
                StageName = "JS",
                Type = "person"
            };

            _context.Artists.AddRange(artist1, artist2, artist3);
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task Should_Return_All_Artists()
        {
            var result = await _repository.GetAll();

            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task Should_Return_All_Person_Artists()
        {
            var result = await _repository.GetAllArtists();

            Assert.All(result, a => Assert.Equal("person", a.Type));
        }

        [Fact]
        public async Task Should_Return_All_Bands()
        {
            var result = await _repository.GetAllBands();

            Assert.All(result, a => Assert.Equal("band", a.Type));
        }

        [Fact]
        public async Task Should_Get_Artist_By_Id()
        {
            var artist = await _repository.GetArtistById(1);

            Assert.NotNull(artist);
            Assert.Equal("JD", artist.StageName);
        }

        [Fact]
        public async Task Should_Add_Artist()
        {
            var newArtist = new Artists
            {
                Id = 4,
                FirstName = "Alice",
                LastName = "Wonder",
                StageName = "AW",
                Type = "person"
            };

            await _repository.AddArtist(newArtist);

            var result = await _repository.GetArtistById(4);
            Assert.NotNull(result);
            Assert.Equal("Alice", result.FirstName);
        }

        [Fact]
        public async Task Should_Update_Artist()
        {
            var artist = await _repository.GetArtistById(1);
            artist.StageName = "UpdatedJD";

            await _repository.UpdateArtist(artist);

            var updated = await _repository.GetArtistById(1);
            Assert.Equal("UpdatedJD", updated.StageName);
        }

        [Fact]
        public async Task Should_Delete_Artist()
        {
            var artist = await _repository.GetArtistById(1);
            await _repository.DeleteArtist(artist);

            var result = await _repository.GetArtistById(1);
            Assert.Null(result);
        }

        [Fact]
        public async Task Should_Add_Band_Member()
        {
            var band = await _repository.GetArtistById(2);
            var member = await _repository.GetArtistById(1);

            await _repository.AddBandMember(band, member);

            var result = await _repository.GetArtistById(2);
            Assert.Contains(result.Members, m => m.Id == 1);
        }

        [Fact]
        public async Task Should_Remove_Band_Member()
        {
            var band = await _repository.GetArtistById(2);
            var member = await _repository.GetArtistById(1);

            band.Members.Add(member);
            await _context.SaveChangesAsync();

            await _repository.RemoveBandMember(band, member);

            var result = await _repository.GetArtistById(2);
            Assert.DoesNotContain(result.Members, m => m.Id == 1);
        }

        [Fact]
        public async Task Should_Search_Artist_By_Name()
        {
            var results = await _repository.Search("JD");

            Assert.Single(results);
            Assert.Equal("JD", results.First().StageName);
        }
    }
}
