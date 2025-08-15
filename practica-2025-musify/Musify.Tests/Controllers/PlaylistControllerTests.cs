using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Musify.Controllers;
using Musify.DTOs.PlaylistDTOs;
using System.Text.Json;
using Xunit;

namespace Musify.Tests.Controllers
{
    public class PlaylistControllerTests
    {
        private readonly Mock<IPlaylistService> _mockService;
        private readonly PlaylistController _controller;

        public PlaylistControllerTests()
        {
            _mockService = GetPlaylistServiceMock();
            _controller = new PlaylistController(_mockService.Object);
        }

        private static Mock<IPlaylistService> GetPlaylistServiceMock()
        {
            var seededPlaylists = new List<Playlists>
            {
                new Playlists
                {
                    Id = 1,
                    Name = "My Favourites",
                    UserId = 1,
                    Type = "public",
                    PlaylistSongs = new List<PlaylistSongs>
                    {
                        new PlaylistSongs { PlaylistId = 1, SongId = 1, Position = 1, Song = new Songs { Title = "Song 1" } },
                        new PlaylistSongs { PlaylistId = 1, SongId = 2, Position = 2, Song = new Songs { Title = "Song 2" } }
                    },
                    PlaylistFollowers = new List<PlaylistFollowers>()
                },
                new Playlists
                {
                    Id = 2,
                    Name = "Chill Vibes",
                    UserId = 2,
                    Type = "private",
                    PlaylistSongs = new List<PlaylistSongs>
                    {
                        new PlaylistSongs { PlaylistId = 2, SongId = 3, Position = 1, Song = new Songs { Title = "Song 3" } }
                    },
                    PlaylistFollowers = new List<PlaylistFollowers>()
                }
            };

            var mock = new Mock<IPlaylistService>();

            mock.Setup(s => s.GetAllPlaylists()).ReturnsAsync(seededPlaylists);
            mock.Setup(s => s.GetPlaylistById(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededPlaylists.FirstOrDefault(p => p.Id == id));
            mock.Setup(s => s.GetPublicPlaylists())
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "public"));
            mock.Setup(s => s.GetPrivatePlaylists())
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "private"));
            mock.Setup(s => s.PlaylistExists(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededPlaylists.Any(p => p.Id == id));
            mock.Setup(s => s.GetFollowedPlaylists(It.IsAny<int>()))
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "public"));
            mock.Setup(s => s.SearchPlaylistsByName(It.IsAny<string>()))
                .ReturnsAsync((string name) => seededPlaylists.Where(p => p.Name != null && p.Name.Contains(name)));
            mock.Setup(s => s.CreatePlaylist(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>()))
                .ReturnsAsync((string name, int userId, string type) =>
                    new Playlists { Id = 3, Name = name, UserId = userId, Type = type });
            mock.Setup(s => s.UpdatePlaylistName(It.IsAny<int>(), It.IsAny<string>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.DeletePlaylist(It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.GetSongsInPlaylist(It.IsAny<int>()))
                .ReturnsAsync((int playlistId) =>
                    seededPlaylists.FirstOrDefault(p => p.Id == playlistId)?.PlaylistSongs ?? new List<PlaylistSongs>());
            mock.Setup(s => s.AddSongToPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.RemoveSongFromPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.UpdatePlaylistSongsOrder(It.IsAny<int>(), It.IsAny<List<int>>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.FollowPublicPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.UnfollowPublicPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.AddAlbumToPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mock.Setup(s => s.RemoveAlbumFromPlaylist(It.IsAny<int>(), It.IsAny<int>())).Returns(Task.CompletedTask);
            mock.Setup(s => s.GetAlbumsFromPlaylist(It.IsAny<int>())).ReturnsAsync(new List<Albums>());

            return mock;
        }

        [Fact]
        public async Task GetPlaylist_ShouldReturnOkWithAllPlaylists()
        {
            var result = await _controller.GetPlaylist();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var playlists = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);
            Assert.NotEmpty(playlists);
        }
        [Fact]
        public async Task GetPlaylistById_ShouldReturnOkWithPlaylist_WhenIdIsValid()
        {
            var result = await _controller.GetPlaylistById(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var playlist = Assert.IsType<PlaylistDto>(okResult.Value);
        }

        [Fact]
        public async Task GetPlaylistById_ShouldReturnBadRequest_WhenIdIsInvalid()
        {
            var result = await _controller.GetPlaylistById(-1);
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetPlaylistById_ShouldReturnNotFound_WhenPlaylistDoesNotExist()
        {
            var result = await _controller.GetPlaylistById(999);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreatePlaylist_ShouldReturnCreatedAtAction_WhenDataIsValid()
        {
            var dto = new Musify.DTOs.PlaylistDTOs.CreatePlaylistDto
            {
                Name = "New Playlist",
                UserId = 1,
                Type = "public"
            };

            var result = await _controller.CreatePlaylist(dto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("GetPlaylistById", createdResult.ActionName);
        }

        [Fact]
        public async Task UpdatePlaylist_ShouldReturnNoContent_WhenDataIsValid()
        {
            var result = await _controller.UpdatePlaylist(1, "Updated Name");
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdatePlaylist_ShouldReturnBadRequest_WhenIdIsInvalid()
        {
            var result = await _controller.UpdatePlaylist(-1, "Name");
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task DeletePlaylist_ShouldReturnNoContent_WhenIdIsValid()
        {
            var result = await _controller.DeletePlaylist(1);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeletePlaylist_ShouldReturnBadRequest_WhenIdIsInvalid()
        {
            var result = await _controller.DeletePlaylist(-1);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task AddSongToPlaylist_ShouldReturnNoContent_WhenDataIsValid()
        {
            _mockService.Setup(s => s.AddSongToPlaylist(1, 999)).Returns(Task.CompletedTask);
            var result = await _controller.AddSongToPlaylist(1, 999);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task RemoveSongFromPlaylist_ShouldReturnNoContent_WhenDataIsValid()
        {
            var result = await _controller.RemoveSongFromPlaylist(1, 1);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetSongsFromPlaylist_ShouldReturnOkWithSongs_WhenPlaylistExists()
        {
            var result = await _controller.GetSongsFromPlaylist(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var songs = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);
            Assert.NotEmpty(songs);
        }

        [Fact]
        public async Task GetPrivatePlaylists_ShouldReturnOkWithPlaylists()
        {
            var result = await _controller.GetPrivatePlaylists();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var playlists = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);
            Assert.NotEmpty(playlists);
        }

        [Fact]
        public async Task GetPublicPlaylists_ShouldReturnOkWithPlaylists()
        {
            var result = await _controller.GetPublicPlaylists();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var playlists = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);
            Assert.NotEmpty(playlists);
        }

        [Fact]
        public async Task GetFollowedPlaylists_ShouldReturnOkWithPlaylists()
        {
            var result = await _controller.GetFollowedPlaylists(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var playlists = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);
            Assert.NotEmpty(playlists);
        }

        [Fact]
        public async Task UpdateSongsOrder_ShouldReturnNoContent_WhenDataIsValid()
        {
            var dto = new Musify.DTOs.PlaylistDTOs.ReorderSongsDto
            {
                SongIdsInOrder = new List<int> { 2, 1 }
            };

            var result = await _controller.UpdateSongsOrder(1, dto);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task FollowPlaylist_ShouldReturnOkWithSuccessMessage()
        {
            
            var result = await _controller.FollowPlaylist(1, 1);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var json = JsonSerializer.Serialize(okResult.Value);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            Assert.True(root.TryGetProperty("message", out var messageProp));
            Assert.Equal("Playlist followed successfully.", messageProp.GetString());
        }

        [Fact]
        public async Task UnfollowPlaylist_ShouldReturnOkWithSuccessMessage()
        {
            var result = await _controller.UnfollowPlaylist(1, 1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = okResult.Value;

            var messageProp = value.GetType().GetProperty("message");
            Assert.NotNull(messageProp);

            var message = messageProp.GetValue(value)?.ToString();
            Assert.Equal("Playlist unfollowed successfully.", message);
        }
        [Fact]
        public async Task SearchPlaylistsByName_ShouldReturnOkWithMatchingPlaylists()
        {
            var result = await _controller.SearchPlaylists("Chill");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var playlists = Assert.IsAssignableFrom<IEnumerable<object>>(okResult.Value);
            Assert.NotEmpty(playlists);
        }

        [Fact]

        public async Task AddAlbumToPlaylist_ShouldReturnOkWithSuccessMessage()
        {
            _mockService.Setup(s => s.AddAlbumToPlaylist(1, 2)).Returns(Task.CompletedTask);
            var result = await _controller.AddAlbumToPlaylist(1, 2);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var json = JsonSerializer.Serialize(okResult.Value);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            Assert.True(root.TryGetProperty("message", out var messageProp));
            Assert.Equal("Album added to playlist successfully.", messageProp.GetString());
        }

        [Fact]
        public async Task RemoveAlbumFromPlaylist_ShouldReturnOkWithSuccessMessage()
        {
            _mockService.Setup(s => s.RemoveAlbumFromPlaylist(It.IsAny<int>(), It.IsAny<int>())).Returns(Task.CompletedTask);
            var result = await _controller.RemoveAlbumFromPlaylist(1, 1);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var json = JsonSerializer.Serialize(okResult.Value);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            Assert.True(root.TryGetProperty("message", out var messageProp));
            Assert.Equal("Album removed from playlist successfully.", messageProp.GetString());
        }

        [Fact]
        public async Task AddSongToPlaylist_ShouldReturnBadRequest_WhenSongAlreadyExists()
        {
            _mockService.Setup(s => s.AddSongToPlaylist(It.IsAny<int>(), It.IsAny<int>())).ThrowsAsync(new Application.Exceptions.BusinessException("Song already exists in playlist."));
            var result = await _controller.AddSongToPlaylist(1, 1);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            var error = badRequest.Value.GetType().GetProperty("error")?.GetValue(badRequest.Value)?.ToString();
            Assert.Equal("Song already exists in playlist.", error);
        }

        [Fact]
        public async Task AddAlbumToPlaylist_ShouldReturnBadRequest_WhenAnySongFromAlbumExists()
        {
            _mockService.Setup(s => s.AddAlbumToPlaylist(It.IsAny<int>(), It.IsAny<int>())).ThrowsAsync(new Application.Exceptions.BusinessException("One or more songs from the album already exist in the playlist."));
            var result = await _controller.AddAlbumToPlaylist(1, 1);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            var error = badRequest.Value.GetType().GetProperty("error")?.GetValue(badRequest.Value)?.ToString();
            Assert.Equal("One or more songs from the album already exist in the playlist.", error);
        }

        [Fact]
        public async Task GetAlbumsFromPlaylist_ShouldReturnOkWithAlbums()
        {
            var albums = new List<Albums> { new Albums { Id = 1, Title = "Test Album" } };
            _mockService.Setup(s => s.GetAlbumsFromPlaylist(It.IsAny<int>())).ReturnsAsync(albums);
            var result = await _controller.GetAlbumsFromPlaylist(1);
            var okResult = Assert.IsType<OkObjectResult>(result);
            var value = Assert.IsAssignableFrom<IEnumerable<Albums>>(okResult.Value);
            Assert.NotEmpty(value);
        }

        [Fact]
        public async Task GetAlbumsFromPlaylist_ShouldReturnNotFound_WhenNoAlbums()
        {
            _mockService.Setup(s => s.GetAlbumsFromPlaylist(It.IsAny<int>())).ReturnsAsync(new List<Albums>());
            var result = await _controller.GetAlbumsFromPlaylist(1);
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
