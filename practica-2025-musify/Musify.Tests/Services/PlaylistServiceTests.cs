using Application.Contracts;
using Application.Exceptions;
using Application.Interfaces;
using Application.UseCases;
using Domain.Entities;
using Moq;
using Xunit;

namespace Musify.Tests.Services
{
    public class PlaylistServiceTests
    {
        private readonly Mock<IPlaylistRepository> _mockRepo;
        private readonly IPlaylistService _service;

        public PlaylistServiceTests()
        {
            _mockRepo = RepositoryMock.GetPlaylistMock(); 
            _service = new PlaylistService(_mockRepo.Object);
        }

        [Fact]
        public async Task GetAllPlaylists_ShouldReturnAllPlaylists()
        {
            var playlists = await _service.GetAllPlaylists();

            Assert.NotNull(playlists);
            Assert.True(playlists.Any());
            _mockRepo.Verify(r => r.GetAllPlaylists(), Times.Once);
        }

        [Fact]
        public async Task GetPlaylistById_ShouldReturnPlaylist_WhenIdExists()
        {
            var playlist = await _service.GetPlaylistById(1);

            Assert.NotNull(playlist);
            Assert.Equal(1, playlist!.Id);
            _mockRepo.Verify(r => r.GetPlaylistById(1), Times.Once);
        }

        [Fact]
        public async Task CreatePlaylist_ShouldReturnNewPlaylist_WhenDataIsValid()
        {
            string name = "New Playlist";
            int userId = 10;
            string type = "private";

            var created = await _service.CreatePlaylist(name, userId, type);

            Assert.NotNull(created);
            Assert.Equal(name, created.Name);
            Assert.Equal(userId, created.UserId);
            Assert.Equal("private", created.Type);
            _mockRepo.Verify(r => r.CreatePlaylist(It.IsAny<Playlists>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePlaylistName_ShouldUpdateName_WhenPlaylistExists()
        {
            string newName = "Updated Name";

            await _service.UpdatePlaylistName(1, newName);

            _mockRepo.Verify(r => r.GetPlaylistById(1), Times.Once);
            _mockRepo.Verify(r => r.UpdatePlaylist(It.Is<Playlists>(p => p.Name == newName)), Times.Once);
        }

        [Fact]
        public async Task UpdatePlaylistName_ShouldThrowBusinessException_WhenPlaylistDoesNotExist()
        {
            await Assert.ThrowsAsync<BusinessException>(async () =>
            {
                await _service.UpdatePlaylistName(999, "Name");
            });

            _mockRepo.Verify(r => r.GetPlaylistById(999), Times.Once);
            _mockRepo.Verify(r => r.UpdatePlaylist(It.IsAny<Playlists>()), Times.Never);
        }

        [Fact]
        public async Task DeletePlaylist_ShouldDeletePlaylist_WhenPlaylistExists()
        {
            await _service.DeletePlaylist(1);

            _mockRepo.Verify(r => r.GetPlaylistById(1), Times.Once);
            _mockRepo.Verify(r => r.DeletePlaylist(1), Times.Once);
        }

        [Fact]
        public async Task DeletePlaylist_ShouldThrowBusinessException_WhenPlaylistDoesNotExist()
        {
            await Assert.ThrowsAsync<BusinessException>(async () =>
            {
                await _service.DeletePlaylist(999);
            });

            _mockRepo.Verify(r => r.GetPlaylistById(999), Times.Once);
            _mockRepo.Verify(r => r.DeletePlaylist(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task AddSongToPlaylist_ShouldAddSong_WhenPlaylistExists()
        {
            // Use a song not already in playlist 1 (e.g., 999)
            await _service.AddSongToPlaylist(1, 999);
            _mockRepo.Verify(r => r.GetPlaylistById(1), Times.Once);
            _mockRepo.Verify(r => r.AddSongToPlaylist(1, 999), Times.Once);
        }

        [Fact]
        public async Task AddSongToPlaylist_ShouldThrowBusinessException_WhenPlaylistDoesNotExist()
        {
            await Assert.ThrowsAsync<BusinessException>(async () =>
            {
                await _service.AddSongToPlaylist(999, 101);
            });

            _mockRepo.Verify(r => r.GetPlaylistById(999), Times.Once);
            _mockRepo.Verify(r => r.AddSongToPlaylist(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task AddSongToPlaylist_ShouldThrowBusinessException_WhenSongAlreadyExists()
        {
            // Arrange: song 101 is already in playlist 1 in the mock
            await Assert.ThrowsAsync<BusinessException>(async () =>
            {
                await _service.AddSongToPlaylist(1, 101);
            });
        }

        [Fact]
        public async Task RemoveSongFromPlaylist_ShouldRemoveSongAndUpdateOrder_WhenDataIsValid()
        {
            await _service.RemoveSongFromPlaylist(1, 101);

            _mockRepo.Verify(r => r.RemoveSongFromPlaylist(1, 101), Times.Once);
            _mockRepo.Verify(r => r.GetSongsInPlaylist(1), Times.Once);
            _mockRepo.Verify(r => r.UpdatePlaylistSongsOrder(It.IsAny<IEnumerable<PlaylistSongs>>()), Times.Once);
        }

        [Fact]
        
        public async Task UpdatePlaylistSongsOrder_ShouldUpdateOrder_WhenOrderIsValid()
        {
            var currentSongs = new List<PlaylistSongs>
    {
        new PlaylistSongs { PlaylistId = 1, SongId = 10, Position = 1 },
        new PlaylistSongs { PlaylistId = 1, SongId = 20, Position = 2 }
    };
            _mockRepo.Setup(r => r.GetSongsInPlaylist(1)).ReturnsAsync(currentSongs);

            var songIds = currentSongs.Select(s => s.SongId).ToList();

            await _service.UpdatePlaylistSongsOrder(1, songIds);

            _mockRepo.Verify(r => r.GetSongsInPlaylist(1), Times.Once);
            _mockRepo.Verify(r => r.UpdatePlaylistSongsOrder(It.IsAny<IEnumerable<PlaylistSongs>>()), Times.Once);
        }

        [Fact]
        public async Task UpdatePlaylistSongsOrder_ShouldThrowBusinessException_WhenOrderIsInvalid()
        {
            var invalidOrder = new List<int> { 999, 888 };

            await Assert.ThrowsAsync<BusinessException>(async () =>
            {
                await _service.UpdatePlaylistSongsOrder(1, invalidOrder);
            });
        }

        [Fact]
        public async Task AddAlbumToPlaylist_ShouldAddAlbumSongs_WhenPlaylistAndAlbumAreValid()
        {
            _mockRepo.Setup(r => r.PlaylistExists(1)).ReturnsAsync(true);
            _mockRepo.Setup(r => r.AlbumExists(2)).ReturnsAsync(true);
            _mockRepo.Setup(r => r.GetAlbumWithSongs(2)).ReturnsAsync(new Albums
            {
                Id = 2,
                AlbumSongs = new List<AlbumSongs> { new AlbumSongs { SongId = 999 } }
            });
            _mockRepo.Setup(r => r.GetSongsInPlaylist(1)).ReturnsAsync(new List<PlaylistSongs>());
            await _service.AddAlbumToPlaylist(1, 2);
            _mockRepo.Verify(r => r.PlaylistExists(1), Times.Once);
            _mockRepo.Verify(r => r.AlbumExists(2), Times.Once);
            _mockRepo.Verify(r => r.AddAlbumSongsToPlaylist(1, 2), Times.Once);
            _mockRepo.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public async Task AddAlbumToPlaylist_ShouldThrowBusinessException_WhenPlaylistDoesNotExist()
        {
            _mockRepo.Setup(r => r.PlaylistExists(999)).ReturnsAsync(false);

            await Assert.ThrowsAsync<BusinessException>(async () =>
            {
                await _service.AddAlbumToPlaylist(999, 1);
            });
        }

        [Fact]
        public async Task AddAlbumToPlaylist_ShouldThrowBusinessException_WhenAlbumDoesNotExist()
        {
            _mockRepo.Setup(r => r.PlaylistExists(1)).ReturnsAsync(true);
            _mockRepo.Setup(r => r.AlbumExists(999)).ReturnsAsync(false);

            await Assert.ThrowsAsync<BusinessException>(async () =>
            {
                await _service.AddAlbumToPlaylist(1, 999);
            });
        }

        [Fact]
        public async Task AddAlbumToPlaylist_ShouldAddOnlyMissingSongs_WhenSomeSongsAlreadyExist()
        {
            // Arrange: album 1 contains song 101 (already in playlist 1) and song 999 (not in playlist 1)
            _mockRepo.Setup(r => r.PlaylistExists(1)).ReturnsAsync(true);
            _mockRepo.Setup(r => r.AlbumExists(1)).ReturnsAsync(true);
            _mockRepo.Setup(r => r.GetAlbumWithSongs(1)).ReturnsAsync(new Albums
            {
                Id = 1,
                AlbumSongs = new List<AlbumSongs> {
                    new AlbumSongs { SongId = 101 }, // already in playlist
                    new AlbumSongs { SongId = 999 }  // not in playlist
                }
            });
            _mockRepo.Setup(r => r.GetSongsInPlaylist(1)).ReturnsAsync(new List<PlaylistSongs> {
                new PlaylistSongs { PlaylistId = 1, SongId = 101 }
            });

            // Act & Assert: should NOT throw, and should call AddAlbumSongsToPlaylist and SaveChanges
            await _service.AddAlbumToPlaylist(1, 1);
            _mockRepo.Verify(r => r.AddAlbumSongsToPlaylist(1, 1), Times.Once);
            _mockRepo.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public async Task SearchPlaylistsByName_ShouldReturnMatchingPlaylists_WhenNameMatches()
        {
            var results = await _service.SearchPlaylistsByName("My Favourites");

            Assert.NotEmpty(results);
            Assert.All(results, p => Assert.Contains("My Favourites", p.Name!));
        }

        [Fact]
        public async Task RemoveAlbumFromPlaylist_ShouldCallRepository()
        {
            await _service.RemoveAlbumFromPlaylist(1, 1);
            _mockRepo.Verify(r => r.RemoveAlbumFromPlaylist(1, 1), Times.Once);
        }

        [Fact]
        public async Task GetAlbumsFromPlaylist_ShouldReturnAlbums()
        {
            var albums = await _service.GetAlbumsFromPlaylist(1);
            Assert.NotNull(albums);
            Assert.True(albums.Any());
            _mockRepo.Verify(r => r.GetAlbumsFromPlaylist(1), Times.Once);
        }
    }
}
