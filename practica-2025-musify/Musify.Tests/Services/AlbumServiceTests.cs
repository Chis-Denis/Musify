using Application.Contracts;
using Application.Exceptions;
using Application.UseCases;
using Domain.Entities;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Musify.Tests.Services
{
    public class AlbumServiceTests
    {
        private readonly Mock<IAlbumRepository> _albumRepoMock;
        private readonly Mock<IArtistRepository> _artistRepoMock;
        private readonly Mock<ISongRepository> _songRepoMock;
        private readonly AlbumService _service;

        public AlbumServiceTests()
        {
            _albumRepoMock = RepositoryMock.GetAlbumMock();
            _artistRepoMock = new Mock<IArtistRepository>();
            _songRepoMock = new Mock<ISongRepository>();
            _service = new AlbumService(_albumRepoMock.Object, _artistRepoMock.Object, _songRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAlbums_ReturnsAllAlbums()
        {
            var result = await _service.GetAllAlbums();
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetAlbumsById_ValidId_ReturnsAlbum()
        {
            var result = await _service.GetAlbumsById(1);
            Assert.NotNull(result);
            Assert.Equal("Debut Album", result.Title);
        }

        [Fact]
        public async Task GetAlbumsById_InvalidId_ThrowsException()
        {
            await Assert.ThrowsAsync<BusinessException>(() => _service.GetAlbumsById(99));
        }

        [Fact]
        public async Task GetAllArtistAlbums_ValidArtistId_ReturnsAlbums()
        {
            _artistRepoMock.Setup(r => r.GetArtistById(4)).ReturnsAsync(new Artists { Id = 4 });
            var result = await _service.GetAllArtistAlbums(4);
            Assert.Single(result);
        }

        [Fact]
        public async Task GetAllArtistAlbums_InvalidArtistId_ThrowsException()
        {
            await Assert.ThrowsAsync<BusinessException>(() => _service.GetAllArtistAlbums(99));
        }

        [Fact]
        public async Task CreateAlbum_WithValidArtist_CreatesAlbum()
        {
            var newAlbum = new Albums
            {
                Id = 3,
                Title = "New Album",
                ArtistId = 1
            };

            _artistRepoMock.Setup(r => r.GetArtistById(1)).ReturnsAsync(new Artists { Id = 1 });

            await _service.CreateAlbum(newAlbum);

            _albumRepoMock.Verify(r => r.CreateAlbums(It.Is<Albums>(a => a.Title == "New Album")), Times.Once);
        }

        [Fact]
        public async Task CreateAlbum_InvalidArtist_ThrowsException()
        {
            var album = new Albums { ArtistId = 999 };

            await Assert.ThrowsAsync<BusinessException>(() => _service.CreateAlbum(album));
        }

        [Fact]
        public async Task AddSongToAlbum_ValidInputs_AddsSuccessfully()
        {
            var newAlbumSong = new AlbumSongs { AlbumId = 1, SongId = 3, Position = 3 };

            _albumRepoMock.Setup(r => r.GetAlbumsById(1)).ReturnsAsync(new Albums { Id = 1 });
            _songRepoMock.Setup(r => r.GetSongById(3)).ReturnsAsync(new Songs { Id = 3 });
            _albumRepoMock.Setup(r => r.GetAlbumSongPosition(1, 3)).ReturnsAsync((int?)null);
            _albumRepoMock.Setup(r => r.CheckAlbumPosition(1, 3)).ReturnsAsync(false);

            await _service.AddSongToAlbum(newAlbumSong);

            _albumRepoMock.Verify(r => r.AddSongToAlbum(It.Is<AlbumSongs>(x => x.SongId == 3 && x.AlbumId == 1)), Times.Once);
        }

        [Fact]
        public async Task AddSongToAlbum_AlreadyInAlbum_ThrowsException()
        {
            var albumSong = new AlbumSongs { AlbumId = 2, SongId = 3, Position = 2 };

            await Assert.ThrowsAsync<BusinessException>(() => _service.AddSongToAlbum(albumSong));
        }

        [Fact]
        public async Task DeleteAlbumSong_SongExistsInAlbum_DeletesSuccessfully()
        {
            _albumRepoMock.Setup(r => r.GetAlbumSongPosition(1, 2)).ReturnsAsync(3);
            _albumRepoMock.Setup(r => r.DeleteAlbumSong(1, 2)).Returns(Task.CompletedTask);

            await _service.DeleteAlbumSong(1, 2);

            _albumRepoMock.Verify(r => r.DeleteAlbumSong(1, 2), Times.Once);
        }

        [Fact]
        public async Task DeleteAlbumSong_SongNotInAlbum_ThrowsBusinessException()
        {
            _albumRepoMock.Setup(r => r.GetAlbumSongPosition(1, 2)).ReturnsAsync((int?)null);

            var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.DeleteAlbumSong(1, 2));
            Assert.Equal("Song 2 is not in album!", ex.Message);
        }

        [Fact]
        public async Task GetAlbumSongPosition_ReturnsPosition()
        {
            _albumRepoMock.Setup(r => r.GetAlbumSongPosition(1, 2)).ReturnsAsync(5);

            var result = await _service.GetAlbumSongPosition(1, 2);

            Assert.Equal(5, result);
        }

        [Fact]
        public async Task CheckAlbumPosition_ReturnsTrueIfTaken()
        {
            _albumRepoMock.Setup(r => r.CheckAlbumPosition(1, 3)).ReturnsAsync(true);

            var result = await _service.CheckAlbumPosition(1, 3);

            Assert.True(result);
        }

        [Fact]
        public async Task UpdateAlbumSong_ValidSongAndAlbum_UpdatesSuccessfully()
        {
            var song = new AlbumSongs { AlbumId = 1, SongId = 2, Position = 1 };

            _albumRepoMock.Setup(r => r.GetAlbumsById(1)).ReturnsAsync(new Albums());
            _songRepoMock.Setup(r => r.GetSongById(2)).ReturnsAsync(new Songs());
            _albumRepoMock.Setup(r => r.CheckAlbumPosition(1, 1)).ReturnsAsync(false);

            await _service.UpdateAlbumSong(song);

            _albumRepoMock.Verify(r => r.UpdateAlbumSong(song), Times.Once);
        }

        [Fact]
        public async Task UpdateAlbumSong_PositionTaken_ThrowsBusinessException()
        {
            var song = new AlbumSongs { AlbumId = 1, SongId = 2, Position = 1 };

            _albumRepoMock.Setup(r => r.GetAlbumsById(1)).ReturnsAsync(new Albums());
            _songRepoMock.Setup(r => r.GetSongById(2)).ReturnsAsync(new Songs());
            _albumRepoMock.Setup(r => r.CheckAlbumPosition(1, 1)).ReturnsAsync(true);

            var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.UpdateAlbumSong(song));
            Assert.Equal("Position already taken!", ex.Message);
        }

        [Fact]
        public async Task SearchAlbumsByGenre_ReturnsAlbums()
        {
            var albums = new List<Albums> { new Albums { Id = 1 } };
            _albumRepoMock.Setup(r => r.SearchAlbumsByGenre("rock")).ReturnsAsync(albums);

            var result = await _service.SearchAlbumsByGenre("rock");

            Assert.Single(result);
            Assert.Equal(1, result.First().Id);
        }

        [Fact]
        public async Task SearchAlbums_ReturnsAlbums()
        {
            var albums = new List<Albums> { new Albums { Id = 2 } };
            _albumRepoMock.Setup(r => r.SearchAlbums("love")).ReturnsAsync(albums);

            var result = await _service.SearchAlbums("love");

            Assert.Single(result);
            Assert.Equal(2, result.First().Id);
        }

        [Fact]
        public async Task DeleteAlbums_AlbumExists_DeletesSuccessfully()
        {
            _albumRepoMock.Setup(r => r.GetAlbumsById(1)).ReturnsAsync(new Albums());
            _albumRepoMock.Setup(r => r.DeleteAlbums(1)).Returns(Task.CompletedTask);

            await _service.DeleteAlbums(1);

            _albumRepoMock.Verify(r => r.DeleteAlbums(1), Times.Once);
        }

        [Fact]
        public async Task DeleteAlbums_AlbumNotFound_ThrowsBusinessException()
        {
            _albumRepoMock.Setup(r => r.GetAlbumsById(1)).ReturnsAsync((Albums?)null);

            var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.DeleteAlbums(1));
            Assert.Equal("Album 1 doesn't exist!", ex.Message);
        }

        [Fact]
        public async Task UpdateAlbums_ArtistExists_UpdatesSuccessfully()
        {
            var album = new Albums { Id = 1, ArtistId = 2 };
            _artistRepoMock.Setup(r => r.GetArtistById(2)).ReturnsAsync(new Artists());
            _albumRepoMock.Setup(r => r.UpdateAlbums(album)).Returns(Task.CompletedTask);

            await _service.UpdateAlbums(album);

            _albumRepoMock.Verify(r => r.UpdateAlbums(album), Times.Once);
        }

        [Fact]
        public async Task UpdateAlbums_ArtistNotExists_ThrowsBusinessException()
        {
            var album = new Albums { Id = 1, ArtistId = 2 };
            _artistRepoMock.Setup(r => r.GetArtistById(2)).ReturnsAsync((Artists?)null);

            var ex = await Assert.ThrowsAsync<BusinessException>(() => _service.UpdateAlbums(album));
            Assert.Equal("Artist 2 doesn't exist!", ex.Message);
        }

        [Fact]
        public async Task GetAllAlbumSongs_ReturnsList()
        {
            var songs = new List<Songs> { new Songs { Id = 1 } };
            _albumRepoMock.Setup(r => r.GetAllAlbumSongs(5)).ReturnsAsync(songs);

            var result = await _service.GetAllAlbumSongs(5);

            Assert.Single(result);
            Assert.Equal(1, result.First().Id);
        }

    }
}
