using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Musify.DTOs.AlbumDTOs;
using Musify.DTOs.AlbumSongsDTOs;
using Musify.DTOs.SongDTOs;
using Musify.Mapping;
using Musify.Validations;

namespace Musify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;
        private readonly AlbumControllerValidator _validator;
        public AlbumController(IAlbumService albumService, AlbumControllerValidator validator)
        {
            _albumService = albumService;
            _validator = validator;

        }

        // GET /api/album
        [HttpGet]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<ActionResult<IEnumerable<AlbumResponseDTO>>> GetAllAlbums()
        {
            var albums = await _albumService.GetAllAlbums();
            var albumDTOs = albums.Select(album => album.ToDTO());
            return Ok(albumDTOs);
        }

        // POST /api/album
        [Authorize(Roles = "admin")]
        [HttpPost]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        public async Task<IActionResult> CreateAlbum([FromBody] AlbumRequestDTO album)
        {
            var errors = await _validator.ValidateCreateAlbum(album);

            if (errors.IsNullOrEmpty())
            {
                var albumEntity = album.ToEntity();
                await _albumService.CreateAlbum(albumEntity);
                return Ok();
            }
            else
            {
                return BadRequest(errors);
            }
        }

        // PUT /api/album
        [Authorize(Roles = "admin")]
        [HttpPut]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        public async Task<IActionResult> UpdateAlbum([FromBody] AlbumDTO album)
        {
            var errors = await _validator.ValidateUpdateAlbum(album);

            if (errors.IsNullOrEmpty())
            {
                var albumEntity = album.ToEntity();

                await _albumService.UpdateAlbums(albumEntity);
                return Ok();
            }
            else
            {
                return BadRequest(errors);
            }
        }

        // POST /api/album/albumSong
        [Authorize(Roles = "admin")]
        [HttpPost("addSong")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        public async Task<IActionResult> AddAlbumSong([FromBody] AlbumSongsDTO albumSongsDTO)
        {
            var errors = await _validator.ValidateAddAlbumSongs(albumSongsDTO);
            if (errors.IsNullOrEmpty())
            {
                var albumSong = albumSongsDTO.ToEntity();
                await _albumService.AddSongToAlbum(albumSong);
                return Ok();
            }
            else
            {
                return BadRequest(errors);
            }
        }


        // GET /api/album/artist/{artistId}
        [HttpGet("artist/{artistId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<IActionResult> GetArtistAlbums(int artistId)
        {
            var albums = await _albumService.GetAllArtistAlbums(artistId);
            var albumDTOs = albums.Select(album => album.ToDTO());
            return albums.Any() ? Ok(albumDTOs) : NotFound();   
        }

        // GET /api/album/{albumId}/songs
        [HttpGet("{albumId}/songs")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<IActionResult> GetAlbumSongs(int albumId)
        {
            var songs = await _albumService.GetAllAlbumSongs(albumId);
            var songDTOs = songs.Select(song =>
            {
                var dto = new BriefSongDTO();
                song.ToDto(dto);
                return dto;
            }
            );
            return songs.Any() ? Ok(songDTOs) : NotFound();
        }

        // GET /api/album/search?query=...
        [HttpGet("search")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            var albums = await _albumService.SearchAlbums(query);
            var albumDTOs = albums.Select(album => album.ToDTO());
            return albums.Any() ? Ok(albumDTOs) : NotFound();
        }

        // GET /api/album/search?query=...
        [HttpGet("searchGenre")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<IActionResult> SearchGenre([FromQuery] string query)
        {
            var albums = await _albumService.SearchAlbumsByGenre(query);
            var albumDTOs = albums.Select(album => album.ToDTO());
            return albums.Any() ? Ok(albumDTOs) : NotFound();
        }

        // GET /api/album/{id}
        [HttpGet("{id}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<IActionResult> GetAlbum(int id)
        {
            var album = await _albumService.GetAlbumsById(id);
            var albumDTO = album.ToDTO();
            return album == null ? NotFound() : Ok(albumDTO);
        }

        // DELETE /api/album/{id}
        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        public async Task<IActionResult> DeleteAlbum(int id)
        {
            await _albumService.DeleteAlbums(id);
            return Ok();
        }

        // DELETE /api/album/
        [Authorize(Roles = "admin")]
        [HttpDelete("deleteSong")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        public async Task<IActionResult> DeleteAlbumSong([FromBody] AlbumSongsDeleteDTO albumSongsDeleteDTO)
        {
            await _albumService.DeleteAlbumSong(albumSongsDeleteDTO.AlbumId, albumSongsDeleteDTO.SongId);
            return Ok();
        }

        // PUT /api/album/{albumId}/song
        [Authorize(Roles = "admin")]
        [HttpPut("updateSong")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        public async Task<IActionResult> UpdateAlbumSong([FromBody] AlbumSongsDTO albumSongsDTO)
        {
            var errors = await _validator.ValidateUpdateAlbumSongs(albumSongsDTO);
            if (errors.IsNullOrEmpty())
            {
                var albumSong = albumSongsDTO.ToEntity();
                await _albumService.UpdateAlbumSong(albumSong);
                return Ok();
            }
            else
            {
                return BadRequest(errors);
            }
        }

        [HttpGet("{albumId}/{songId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        public async Task<IActionResult> GetSongPosition(int albumId, int songId)
        {
            var position = await _albumService.GetAlbumSongPosition(albumId, songId);
            return position == null ? NotFound() : Ok(position);
        }
    }
}
