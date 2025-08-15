using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Musify.DTOs.ArtistDTOs;
using Musify.Mapping;
using Musify.Validations;

namespace Musify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiConventionType(typeof(DefaultApiConventions))] 
    public class ArtistController : ControllerBase
    {
        private readonly IArtistService _artistService;

        public ArtistController(IArtistService artistService)
        {
            _artistService = artistService;
        }

        [HttpGet("{id}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Artists>> GetArtistById(int id)
        {
            var artist = await _artistService.GetArtistById(id);
            return artist == null ? NotFound() : Ok(artist);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Artists>> CreateArtist([FromBody] ArtistDto artistDto)
        {
            var validationErrors = ArtistControllerValidator.ValidateArtistCreate(artistDto);
            if (validationErrors.Any())
                return BadRequest(validationErrors);

            var artist = artistDto.ToEntity();
            await _artistService.AddArtist(artist);
            return Ok();
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Artists>> UpdateArtist([FromBody] ArtistUpdateDto artistDto)
        {
            var validationErrors = ArtistControllerValidator.ValidateArtistUpdate(artistDto);
            if (validationErrors.Any())
                return BadRequest(validationErrors);

            var artist = artistDto.ToEntity();
            await _artistService.UpdateArtist(artist);
            var createdArtist = await _artistService.GetArtistById(artistDto.Id);
            return Ok(createdArtist);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteArtist(int id)
        {
            var artist = await _artistService.GetArtist(id);
            await _artistService.DeleteArtist(artist);
            return Ok();
        }

        [HttpGet]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Artists>>> GetAll([FromQuery] string? type)
        {
            var artists = await _artistService.GetAll(type);
            return Ok(artists);
        }

        [HttpPost("members")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BandMemberDto>> CreateBandMember([FromBody] BandMemberDto dto)
        {
            var band = await _artistService.GetArtist(dto.BandId);
            var member = await _artistService.GetArtist(dto.MemberId);

            if (band.Members.Any(m => m.Id == dto.MemberId))
                return BadRequest("Member already in band.");

            await _artistService.AddBandMember(band, member);

            return Ok(dto);
        }

        [HttpDelete("members")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteBandMember([FromBody] BandMemberDto dto)
        {
            var band = await _artistService.GetArtist(dto.BandId);
            var member = band.Members.FirstOrDefault(m => m.Id == dto.MemberId);

            if (member == null)
                return BadRequest("Member is not in band.");

            await _artistService.RemoveBandMember(band, member);

            return NoContent();
        }

        [HttpGet("search")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<Artists>>> Search([FromQuery] string name)
        {
            var artists = await _artistService.Search(name);
            return Ok(artists);
        }

    }

}

