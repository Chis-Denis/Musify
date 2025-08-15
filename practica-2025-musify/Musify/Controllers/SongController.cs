using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Musify.DTOs.SongDTOs;
using Musify.Mapping;
using Musify.Validations;

namespace Musify.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
    [ApiController]
    [Route("api/[controller]")]
    public class SongController : ControllerBase
    {
        private readonly ISongService _songService;

        public SongController(ISongService songService)
        {
            _songService = songService
                ?? throw new ArgumentNullException(nameof(songService));
        }

        [HttpGet]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BriefSongDTO>>> GetSong()
        {
            var songs = await _songService.GetAllSongs();
            var result = songs.Select(s =>
            {
                var dto = new BriefSongDTO();
                s.ToDto(dto);
                return dto;
            });
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BriefSongDTO>> Get(int id)
        {
            var idErrors = SongValidation.ValidateSongId(id);
            if (idErrors.Any())
                return BadRequest(idErrors);

            var song = await _songService.GetSongById(id);
            var dto = new BriefSongDTO();
            song.ToDto(dto);
            return Ok(dto);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BriefSongDTO>> CreateSong([FromBody] BriefSongCreationDTO dto)
        {
            var dtoErrors = SongValidation.ValidateSongCreate(dto);
            if (dtoErrors.Any())
                return BadRequest(dtoErrors);

            var entity = dto.ToEntity();
            var created = await _songService.CreateSong(entity);

            var result = new BriefSongDTO();
            created.ToDto(result);
            return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateSong(int id, [FromBody] BriefSongUpdateDTO dto)
        {
            var idErrors = SongValidation.ValidateSongId(id);
            var dtoErrors = SongValidation.ValidateSongUpdate(dto);
            var errors = idErrors
                .Concat(dtoErrors)
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            if (errors.Any())
                return BadRequest(errors);

            var existing = await _songService.GetSongById(id);

            if (existing == null)
                return NotFound();

            dto.ToEntity(existing);

            try
            {
                await _songService.UpdateSong(existing);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }


        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteSong(int id)
        {
            await _songService.DeleteSong(id);
            return NoContent();
        }

        [HttpPut("{id:int}/titles-alternative")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SetAlternativeTitles(int id, [FromBody] AlternativeTitlesSongDTO dto)
        {
            var idErrors = SongValidation.ValidateSongId(id);
            var dtoErrors = SongValidation.ValidateAlternativeTitles(dto);
            var errors = idErrors
                .Concat(dtoErrors)
                .ToDictionary(kv => kv.Key, kv => kv.Value);
            if (errors.Any())
                return BadRequest(errors);

            var alternatives = dto.ToAlternativeEntities(id);

            try
            {
                await _songService.AddAlternativeTitles(id, alternatives);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("search")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<SongWithAlternativeTitlesDTO>>> SearchSong([FromQuery] string name)
        {
            var errors = SongValidation.ValidateSongSearch(name);
            if (errors.Any())
                return BadRequest(errors);

            var songs = await _songService.SearchSongsByName(name);
            if (!songs.Any())
                return NotFound();

            var result = songs.Select(s =>
            {
                var dto = new SongWithAlternativeTitlesDTO();
                s.ToDto(dto);
                return dto;
            });
            return Ok(result);  
        }

        [HttpGet("trending")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BriefSongDTO>>> GetTrendingSongs()
        {
            var trending = await _songService.GetTrendingSongs();
            var result = trending.Select(s =>
            {
                var dto = new BriefSongDTO();
                s.ToDto(dto);
                return dto;
            });
            return Ok(result);
        }


        // GET /api/song/artist/{artistId}
        [HttpGet("artist/{artistId:int}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<BriefSongDTO>>> GetArtistSongs(int artistId)
        {
            var songs = await _songService.GetAllArtistSongs(artistId);
            if (!songs.Any())
                return NotFound();

            var result = songs.Select(s =>
            {
                var dto = new BriefSongDTO();
                s.ToDto(dto);
                return dto;
            });
            return Ok(result);
        }

    }
}
