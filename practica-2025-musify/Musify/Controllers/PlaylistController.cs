using Application.Exceptions;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Musify.DTOs.PlaylistDTOs;
using Musify.Mappings;
using Musify.Validations;

namespace Musify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiConventionType(typeof(DefaultApiConventions))] 
    public class PlaylistController : ControllerBase
    {
        private readonly IPlaylistService _playlistService;

        public PlaylistController(IPlaylistService playlistService)
        {
            _playlistService = playlistService;
        }

        [HttpGet]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetPlaylist()
        {
            var playlists = await _playlistService.GetAllPlaylists();
            return Ok(playlists.Select(p => p.ToDto()));
        }

        [HttpGet("{id}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PlaylistDto>> GetPlaylistById(int id)
        {
            var errors = PlaylistValidations.ValidatePlaylistId(id);
            if (errors.Any())
                return BadRequest(errors);

            var playlist = await _playlistService.GetPlaylistById(id);

            if (playlist == null)
                return NotFound();

            return Ok(playlist.ToDto());
        }

        [HttpPost]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistDto dto)
        {
            var errors = PlaylistValidations.ValidatePlaylistCreate(dto);
            if (errors.Any()) return BadRequest(errors);

            var created = await _playlistService.CreatePlaylist(dto.Name!, dto.UserId, dto.Type);
            return CreatedAtAction(nameof(GetPlaylistById), new { id = created.Id }, created.ToDto());
        }

        [HttpPut("{id}/name")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePlaylist(int id, [FromBody] string newName)
        {
            var errors = PlaylistValidations.ValidatePlaylistUpdateName(newName)
                .Concat(PlaylistValidations.ValidatePlaylistId(id));
            if (errors.Any()) return BadRequest(errors);

            await _playlistService.UpdatePlaylistName(id, newName);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePlaylist(int id)
        {
            var errors = PlaylistValidations.ValidatePlaylistId(id);
            if (errors.Any()) return BadRequest(errors);

            var playlist = await _playlistService.GetPlaylistById(id);
            if (playlist == null) return NotFound();

            await _playlistService.DeletePlaylist(id);
            return NoContent();
        }

        [HttpPost("{id}/songs")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddSongToPlaylist(int id, [FromBody] int songId)
        {
            var errors = PlaylistValidations.ValidateAddSongToPlaylist(id, songId);
            if (errors.Any()) return BadRequest(errors);
            try
            {
                await _playlistService.AddSongToPlaylist(id, songId);
                return NoContent();
            }
            catch (BusinessException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{playlistId}/songs/{songId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var errors = PlaylistValidations.ValidateAddSongToPlaylist(playlistId, songId);
            if (errors.Any()) return BadRequest(errors);

            await _playlistService.RemoveSongFromPlaylist(playlistId, songId);
            return NoContent();
        }

        [HttpGet("{id}/songs")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<object>>> GetSongsFromPlaylist(int id)
        {
            var songs = await _playlistService.GetSongsInPlaylist(id);
            var result = songs.Select(ps => new
            {
                ps.SongId,
                ps.Position,
                SongTitle = ps.Song?.Title
            });

            return Ok(result);
        }

        [HttpGet("private")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetPrivatePlaylists()
        {
            var playlists = await _playlistService.GetPrivatePlaylists();
            if (playlists == null || !playlists.Any())
                return NotFound();

            return Ok(playlists.Select(p => p.ToDto()));
        }

        [HttpGet("public")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetPublicPlaylists()
        {
            var playlists = await _playlistService.GetPublicPlaylists();
            if (playlists == null || !playlists.Any())
                return NotFound();

            return Ok(playlists.Select(p => p.ToDto()));
        }

        [HttpGet("followed/{userId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetFollowedPlaylists(int userId)
        {
            var playlists = await _playlistService.GetFollowedPlaylists(userId);
            return Ok(playlists.Select(p => p.ToDto()));
        }

        [HttpPut("{id}/songs/order")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Put))]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateSongsOrder(int id, [FromBody] ReorderSongsDto dto)
        {
            var errors = PlaylistValidations.ValidatePlaylistId(id);
            if (errors.Any()) return BadRequest(errors);

            await _playlistService.UpdatePlaylistSongsOrder(id, dto.SongIdsInOrder);
            return NoContent();
        }

        [HttpPost("{playlistId}/follow/{userId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> FollowPlaylist(int playlistId, int userId)
        {
            try
            {
                await _playlistService.FollowPublicPlaylist(playlistId, userId);
                return Ok(new { message = "Playlist followed successfully." });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{playlistId}/unfollow/{userId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UnfollowPlaylist(int playlistId, int userId)
        {
            try
            {
                await _playlistService.UnfollowPublicPlaylist(playlistId, userId);
                return Ok(new { message = "Playlist unfollowed successfully." });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{playlistId}/albums/{albumId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Post))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddAlbumToPlaylist(int playlistId, int albumId)
        {
            try
            {
                await _playlistService.AddAlbumToPlaylist(playlistId, albumId);
                return Ok(new { message = "Album added to playlist successfully." });
            }
            catch (BusinessException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{playlistId}/albums/{albumId}")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Delete))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveAlbumFromPlaylist(int playlistId, int albumId)
        {
            await _playlistService.RemoveAlbumFromPlaylist(playlistId, albumId);
            return Ok(new { message = "Album removed from playlist successfully." });
        }

        [HttpGet("{playlistId}/albums")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAlbumsFromPlaylist(int playlistId)
        {
            var albums = await _playlistService.GetAlbumsFromPlaylist(playlistId);
            if (albums == null || !albums.Any())
                return NotFound();
            return Ok(albums);
        }

        [HttpGet("search")]
        [ApiConventionMethod(typeof(DefaultApiConventions), nameof(DefaultApiConventions.Get))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SearchPlaylists([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest(new { error = "Name parameter is required." });

            var playlists = await _playlistService.SearchPlaylistsByName(name);
            return Ok(playlists.Select(p => p.ToDto()));
        }
    }
}
