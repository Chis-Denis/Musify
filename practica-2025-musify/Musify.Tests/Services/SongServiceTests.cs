using Application.Contracts;
using Application.Exceptions;
using Application.Interfaces;
using Application.UseCases;
using Domain.Entities;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Musify.Tests.Services
{
    public class SongServiceTests
    {
        private readonly Mock<ISongRepository> _mockRepo;
        private readonly ISongService _service;

        public SongServiceTests()
        {
            _mockRepo = RepositoryMock.GetMockSongRepository();
            _service = new SongService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllSongs_ReturnsAllSongs()
        {
            var songs = await _service.GetAllSongs();

            Assert.NotNull(songs);
            Assert.True(songs.Any());
            _mockRepo.Verify(r => r.GetAllSongs(), Times.Once);
        }

        [Theory]
        [InlineData(1)]
        public async Task GetSongById_ExistingId_ReturnsSong(int id)
        {
            var song = await _service.GetSongById(id);

            Assert.NotNull(song);
            Assert.Equal(id, song.Id);
            _mockRepo.Verify(r => r.GetSongByIdWithArtists(id), Times.Once);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(42)]
        public async Task GetSongById_NonExistingId_ThrowsBusinessException(int id)
        {

            await Assert.ThrowsAsync<BusinessException>(() => _service.GetSongById(id));
            _mockRepo.Verify(r => r.GetSongByIdWithArtists(id), Times.Once);
        }

        [Fact]
        public async Task SearchSongsByName_FindsMatches()
        {
            var result = await _service.SearchSongsByName("Echoes");

            Assert.NotEmpty(result);
            Assert.All(result, s => Assert.Contains("Echoes", s.Title, StringComparison.OrdinalIgnoreCase));
            _mockRepo.Verify(r => r.SearchSongsByName("Echoes"), Times.Once);
        }

        [Fact]
        public async Task GetTrendingSongs_ReturnsTopSongs()
        {
            var result = await _service.GetTrendingSongs();

            Assert.NotNull(result);
            Assert.True(result.Count() <= 3);
            _mockRepo.Verify(r => r.GetTrendingSongs(), Times.Once);
        }

        [Fact]
        public async Task AddAlternativeTitles_NullAlternatives_ThrowsBusinessException()
        {
            await Assert.ThrowsAsync<BusinessException>(() => _service.AddAlternativeTitles(1, null!));
        }

        [Fact]
        public async Task AddAlternativeTitles_NonExistingSong_ThrowsBusinessException()
        {
            await Assert.ThrowsAsync<BusinessException>(() => _service.AddAlternativeTitles(99, new List<SongAlternativeTitles>()));
            _mockRepo.Verify(r => r.GetByIdWithAlternatives(99), Times.Once);
        }

        [Fact]
        public async Task AddAlternativeTitles_Valid_AddsNewAndSaves()
        {
            var before = (await _service.GetSongById(1)).AlternativeTitles.Count;
            var newAlts = new List<SongAlternativeTitles>
            {
                new SongAlternativeTitles { AlternativeTitle = "Unique", Language = "xx" }
            };

            await _service.AddAlternativeTitles(1, newAlts);

            var updated = await _service.GetSongById(1);
            Assert.Equal(before + 1, updated.AlternativeTitles.Count);
            Assert.Contains(updated.AlternativeTitles, at => at.AlternativeTitle == "Unique");
            _mockRepo.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public async Task DeleteSong_ExistingId_RemovesSong()
        {
            var initial = (await _service.GetAllSongs()).Count();
            await _service.DeleteSong(2);

            var remaining = await _service.GetAllSongs();
            Assert.Equal(initial - 1, remaining.Count());
            Assert.DoesNotContain(remaining, s => s.Id == 2);
            _mockRepo.Verify(r => r.DeleteSong(It.IsAny<Songs>()), Times.Once);
        }

        [Fact]
        public async Task DeleteSong_NonExistingId_ThrowsBusinessException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<BusinessException>(() => _service.DeleteSong(999));
            _mockRepo.Verify(r => r.GetSongById(999), Times.Once);
        }
    }
}
