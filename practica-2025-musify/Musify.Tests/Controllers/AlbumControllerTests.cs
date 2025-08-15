using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Musify.Controllers;
using Musify.DTOs.AlbumDTOs;
using Musify.DTOs.AlbumSongsDTOs;
using Musify.DTOs.SongDTOs;
using Musify.Validations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Musify.Tests.Controllers
{
    public class AlbumControllerTests
    {
        private readonly Mock<IAlbumService> _albumServiceMock;
        private readonly AlbumControllerValidator _validator;
        private readonly AlbumController _controller;

        public AlbumControllerTests()
        {
            _albumServiceMock = new Mock<IAlbumService>();
            _validator = new AlbumControllerValidator();
            _controller = new AlbumController(_albumServiceMock.Object, _validator);
        }

        [Fact]
        public async Task GetAllAlbums_ReturnsOk_WithAlbums()
        {
            var albums = new List<Albums>
            {
            new() { Id = 1, Title = "Test", Genre = "Rock", Label = "X", ReleaseDate = System.DateTime.UtcNow, ArtistId = 1 }
            };
            _albumServiceMock.Setup(s => s.GetAllAlbums()).ReturnsAsync(albums);

            var result = await _controller.GetAllAlbums();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var dtoList = Assert.IsAssignableFrom<IEnumerable<AlbumResponseDTO>>(okResult.Value);
            Assert.Single(dtoList);
        }

        [Fact]
        public async Task CreateAlbum_WithInvalidData_ReturnsBadRequest()
        {
            var dto = new AlbumRequestDTO(); 
            var result = await _controller.CreateAlbum(dto);

            var badResult = Assert.IsType<BadRequestObjectResult>(result);
            var errors = Assert.IsAssignableFrom<Dictionary<string, string>>(badResult.Value);
            Assert.NotEmpty(errors);
        }

        [Fact]
        public async Task CreateAlbum_WithValidData_CallsService()
        {
            var dto = new AlbumRequestDTO
            {
                Title = "Valid",
                Genre = "Genre",
                Label = "Label",
                ReleaseDate = System.DateTime.UtcNow.AddDays(-1),
                ArtistId = 1
            };

            var result = await _controller.CreateAlbum(dto);

            _albumServiceMock.Verify(s => s.CreateAlbum(It.IsAny<Albums>()), Times.Once);
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task UpdateAlbum_WithInvalidData_ReturnsBadRequest()
        {
            var invalidDto = new AlbumDTO();

            var result = await _controller.UpdateAlbum(invalidDto);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            var errorDict = Assert.IsAssignableFrom<Dictionary<string, string>>(badRequest.Value);
            Assert.True(errorDict.ContainsKey("Title"));
        }

        [Fact]
        public async Task UpdateAlbum_WithValidData_CallsService()
        {
            var validDto = new AlbumDTO
            {
                Id = 5,
                Title = "Updated",
                Genre = "Pop",
                Label = "LabelY",
                ReleaseDate = DateTime.UtcNow.AddYears(-1),
                ArtistId = 2
            };

            var result = await _controller.UpdateAlbum(validDto);

            _albumServiceMock.Verify(s => s.UpdateAlbums(It.Is<Albums>(a => a.Id == 5 && a.Title == "Updated")), Times.Once);
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task GetAlbumSongs_WithValidId_ReturnsOk()
        {
            var albumId = 3;
            _albumServiceMock.Setup(s => s.GetAllAlbumSongs(albumId)).ReturnsAsync(new List<Songs>
            {
               new() { Id = 1, Title = "Song A", Duration = new TimeSpan(0, 3, 30), CreationDate = new DateTime(2021, 1, 1) },
            });

            var result = await _controller.GetAlbumSongs(albumId);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var list = Assert.IsAssignableFrom<IEnumerable<BriefSongDTO>>(okResult.Value);
            Assert.Single(list);
        }

        [Fact]
        public async Task GetAlbumSongs_EmptyList_ReturnsNotFound()
        {
            _albumServiceMock.Setup(s => s.GetAllAlbumSongs(99)).ReturnsAsync(new List<Songs>());
            var result = await _controller.GetAlbumSongs(99);

            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Search_WithMatchingQuery_ReturnsFilteredResults()
        {
            var albums = new List<Albums>
            {
            new() { Title = "First Album", Genre = "Rock", Label = "Label1", ReleaseDate = DateTime.Now, ArtistId = 1 },
            };

            _albumServiceMock.Setup(s => s.SearchAlbums("first")).ReturnsAsync(albums);

            var result = await _controller.Search("first");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var filtered = Assert.IsAssignableFrom<IEnumerable<AlbumResponseDTO>>(okResult.Value);
            Assert.Single(filtered);
            Assert.Contains(filtered, a => a.Title.ToLower().Contains("first"));
        }

        [Fact]
        public async Task SearchGenre_WithMatchingQuery_ReturnsFilteredResults()
        {
            var albums = new List<Albums>
            {
            new() { Title = "First Album", Genre = "Rock", Label = "Label1", ReleaseDate = DateTime.Now, ArtistId = 1 },
            };

            _albumServiceMock.Setup(s => s.SearchAlbumsByGenre("rock")).ReturnsAsync(albums);

            var result = await _controller.SearchGenre("rock");

            var okResult = Assert.IsType<OkObjectResult>(result);
            var filtered = Assert.IsAssignableFrom<IEnumerable<AlbumResponseDTO>>(okResult.Value);
            Assert.Single(filtered);
            Assert.Contains(filtered, a => a.Genre.ToLower().Contains("rock"));
        }
    }
}
