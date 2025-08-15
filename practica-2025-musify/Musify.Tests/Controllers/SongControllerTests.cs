using Application.Exceptions;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Musify.Controllers;
using Musify.DTOs.SongDTOs;
using Xunit;

namespace Musify.Tests.Controllers
{
    public class SongControllerTests
    {
        private readonly Mock<ISongService> _mockService;
        private readonly SongController _controller;

        public SongControllerTests()
        {
            _mockService = ServiceMock.GetSongServiceMock();
            _controller = new SongController(_mockService.Object);
        }

        [Fact]
        public async Task GetSong_ReturnsAllSongs()
        { 
            var actionResult = await _controller.GetSong();

            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dtos = Assert.IsAssignableFrom<IEnumerable<BriefSongDTO>>(okResult.Value);
            Assert.Equal(5, dtos.Count());
        }

        [Theory]
        [InlineData(1)]
        [InlineData(5)]
        public async Task Get_ValidId_ReturnsSong(int id)
        {
            // Act
            var actionResult = await _controller.Get(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dto = Assert.IsType<BriefSongDTO>(okResult.Value);
            Assert.Equal(id, dto.Id);
        }

        [Theory]
        [InlineData(-2)]
        [InlineData(-1)]
        public async Task Get_InvalidId_ReturnsBadRequest(int id)
        {
            var actionResult = await _controller.Get(id);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task Get_NotFound_ThrowsBusinessException()
        {
            _mockService
              .Setup(s => s.GetSongById(It.IsAny<int>()))
              .ThrowsAsync(new BusinessException("Song not found"));

            await Assert.ThrowsAsync<BusinessException>(
                () => _controller.Get(999)
            );
        }


        [Fact]
        public async Task CreateSong_Valid_ReturnsCreated()
        {
            var dto = new BriefSongCreationDTO { Title = "New Song", CreationDate = DateTime.UtcNow };
            var actionResult = await _controller.CreateSong(dto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            Assert.Equal(nameof(_controller.Get), createdResult.ActionName);
        }

        [Fact]
        public async Task CreateSong_InvalidModel_ReturnsBadRequest()
        {
            var dto = new BriefSongCreationDTO { Title = "", CreationDate = DateTime.UtcNow };
            var actionResult = await _controller.CreateSong(dto);
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task UpdateSong_Valid_ReturnsNoContent()
        {
            var dto = new BriefSongUpdateDTO { Title = "Updated", ArtistIds = new List<int>() };
            var result = await _controller.UpdateSong(1, dto);
            Assert.IsType<NoContentResult>(result);
        }

        [Theory]
        [InlineData(-2)]
        [InlineData(-1)]
        public async Task UpdateSong_InvalidId_ReturnsBadRequest(int id)
        {
            var dto = new BriefSongUpdateDTO { Title = "X", ArtistIds = new List<int>() };
            var result = await _controller.UpdateSong(id, dto);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UpdateSong_NotFound_ReturnsNotFound()
        {
            _mockService.Setup(s => s.GetSongById(It.IsAny<int>())).ReturnsAsync((Songs)null);
            var dto = new BriefSongUpdateDTO { Title = "X", ArtistIds = new List<int>() };
            var result = await _controller.UpdateSong(1, dto);
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteSong_Valid_ReturnsNoContent()
        {
            var result = await _controller.DeleteSong(1);
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteSong_NotFound_ThrowsBusinessException()
        {
            _mockService.Setup(s => s.DeleteSong(It.IsAny<int>()))
                        .ThrowsAsync(new Application.Exceptions.BusinessException("Not found"));
            await Assert.ThrowsAsync<Application.Exceptions.BusinessException>(() => _controller.DeleteSong(999));
        }

        [Fact]
        public async Task SearchSong_ReturnsSongs()
        {
            var actionResult = await _controller.SearchSong("Ocean");
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dtos = Assert.IsAssignableFrom<IEnumerable<SongWithAlternativeTitlesDTO>>(okResult.Value);
            Assert.All(dtos, dto => Assert.NotNull(dto.AlternativeTitles));
        }

        [Fact]
        public async Task SearchSong_NoMatches_ReturnsNotFound()
        {
            _mockService.Setup(s => s.SearchSongsByName(It.IsAny<string>())).ReturnsAsync(Enumerable.Empty<Songs>());
            var actionResult = await _controller.SearchSong("ZZZ");
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetTrendingSongs_ReturnsTop3()
        {
            var actionResult = await _controller.GetTrendingSongs();
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dtos = Assert.IsAssignableFrom<IEnumerable<BriefSongDTO>>(okResult.Value);
            Assert.Equal(3, dtos.Count());
        }

        [Fact]
        public async Task GetArtistSongs_NoSongs_ReturnsNotFound()
        {
            _mockService.Setup(s => s.GetAllArtistSongs(It.IsAny<int>())).ReturnsAsync(Enumerable.Empty<Songs>());
            var actionResult = await _controller.GetArtistSongs(99);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task GetArtistSongs_ReturnsSongs()
        {
            var song = new Songs { Id = 6, Title = "Artist Song", SongArtists = new List<SongArtists> { new SongArtists { ArtistId = 42, Artist = new Artists { Id = 42 } } } };
            _mockService.Setup(s => s.GetAllArtistSongs(42)).ReturnsAsync(new[] { song });

            var actionResult = await _controller.GetArtistSongs(42);

            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var dtos = Assert.IsAssignableFrom<IEnumerable<BriefSongDTO>>(okResult.Value);
            Assert.Single(dtos);
        }

        [Fact]
        public async Task SetAlternativeTitles_Valid_ReturnsNoContent()
        {
            var dto = new AlternativeTitlesSongDTO
            {
                Title = new List<string> { "Aurore Sérénade", "Échos de Minuit" },
                Language = new List<string?> { "French", "French" }
            };

            var result = await _controller.SetAlternativeTitles(1, dto);
            Assert.IsType<NoContentResult>(result);
        }

        [Theory]
        [InlineData(-2)]
        [InlineData(-1)]
        public async Task SetAlternativeTitles_InvalidId_ReturnsBadRequest(int id)
        {
            var dto = new AlternativeTitlesSongDTO { Title = new List<string> { "Alt" }, Language = new List<string?> { "en" } };

            var result = await _controller.SetAlternativeTitles(id, dto);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task SetAlternativeTitles_MismatchedLists_ReturnsBadRequest()
        {
            var dto = new AlternativeTitlesSongDTO { Title = new List<string> { "Alt1" }, Language = new List<string?> { "en", "fr" } };
            var result = await _controller.SetAlternativeTitles(1, dto);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task SetAlternativeTitles_NotFound_ReturnsNotFound()
        {
            _mockService.Setup(s => s.AddAlternativeTitles(It.IsAny<int>(), It.IsAny<List<SongAlternativeTitles>>()))
                        .ThrowsAsync(new KeyNotFoundException());
            var dto = new AlternativeTitlesSongDTO { Title = new List<string> { "Alt" }, Language = new List<string?> { "en" } };
            var result = await _controller.SetAlternativeTitles(999, dto);
            Assert.IsType<NotFoundResult>(result);
        }
    }
}