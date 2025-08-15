using Application.Contracts;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AlbumRepository : IAlbumRepository
{
    private readonly MusifyDbContext _context;

    public AlbumRepository(MusifyDbContext context)
    {
        _context = context;
    }

    public async Task AddSongToAlbum(AlbumSongs albumSong)
    {
        _context.Set<AlbumSongs>().Add(albumSong);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> CheckAlbumPosition(int albumId, int position)
    {
        var song = _context.AlbumSongs.Where(s => s.AlbumId == albumId).Select(s => s.Position);
        if (song.Contains(position))
            return true;
        return false;
            
     }

    public async Task CreateAlbums(Albums album)
    {
        await _context.AddAsync(album);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAlbums(int id)
    {
        var album = await _context.Albums.FindAsync(id);
        _context.Albums.Remove(album);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAlbumSong(int albumId, int songId)
    {
        var albumSong = await _context.AlbumSongs
        .FirstOrDefaultAsync(asg => asg.AlbumId == albumId && asg.SongId == songId);
        _context.AlbumSongs.Remove(albumSong);
        await _context.SaveChangesAsync();
    }

    public async Task<Albums?> GetAlbumsById(int id)
    {
        return await _context.Albums.FindAsync(id);
    }

    public async Task<int?> GetAlbumSongPosition(int albumId, int songId)
    {
        var albumSong = await _context.AlbumSongs
        .FirstOrDefaultAsync(asg => asg.AlbumId == albumId && asg.SongId == songId);
        return albumSong == null ? null : albumSong.Position;
    }

    public async Task<IEnumerable<Albums>> GetAllAlbums()
        => await _context.Albums.ToListAsync();

    public async Task<IEnumerable<Songs>> GetAllAlbumSongs(int albumId)
    {
        return await _context.AlbumSongs
        .Where(asg => asg.AlbumId == albumId)
        .OrderBy(asg => asg.Position)
        .Include(asg => asg.Song)                
        .ThenInclude(s => s.SongArtists)      
        .ThenInclude(sa => sa.Artist)          
        .Select(asg => asg.Song)                   
        .ToListAsync();
    }

    public async Task<IEnumerable<Albums>> GetAllArtistAlbums(int artistId)
        => await _context.Albums.Where(a => a.ArtistId == artistId).ToListAsync();

    public async Task<IEnumerable<Albums>> SearchAlbums(string searchQuery)
    {
        return await _context.Albums
                      .Where(a => a.Title.Contains(searchQuery))
                      .ToListAsync(); 
    }

    public async Task<IEnumerable<Albums>> SearchAlbumsByGenre(string searchQuery)
    {
        return await _context.Albums
                       .Where(a => a.Genre.Contains(searchQuery))
                       .ToListAsync();
    }

    public async Task UpdateAlbums(Albums updatedAlbum)
    {
        var existing = await _context.Albums.FindAsync(updatedAlbum.Id);

        existing.Title = updatedAlbum.Title;
        existing.Description = updatedAlbum.Description;
        existing.Genre = updatedAlbum.Genre;
        existing.ReleaseDate = updatedAlbum.ReleaseDate;
        existing.Label = updatedAlbum.Label;
        existing.ArtistId = updatedAlbum.ArtistId;

        await _context.SaveChangesAsync();
    }

    public async Task UpdateAlbumSong(AlbumSongs albumSong)
    {
        var song = await _context.AlbumSongs
       .FirstOrDefaultAsync(asg => asg.AlbumId == albumSong.AlbumId && asg.SongId == albumSong.SongId);

        song.SongId = albumSong.SongId;
        song.AlbumId = albumSong.AlbumId;
        song.Position = albumSong.Position;
        await _context.SaveChangesAsync();
    }
}
