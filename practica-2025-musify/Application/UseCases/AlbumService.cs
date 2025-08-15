using Application.Contracts;
using Application.Exceptions;
using Domain.Entities;

namespace Application.UseCases
{
    public class AlbumService : IAlbumService
    {
        private readonly IAlbumRepository _repository;
        private readonly IArtistRepository _artistRepository;
        private readonly ISongRepository _songRepository;

        public AlbumService(IAlbumRepository repository, IArtistRepository artistRepository, ISongRepository songRepository)
        {
            _repository = repository;
            _artistRepository = artistRepository;
            _songRepository = songRepository;
        }

        public async Task CreateAlbum(Albums album)
        {
            if (await _artistRepository.GetArtistById(album.ArtistId.Value) == null)
            {
                throw new BusinessException($"Artist {album.ArtistId.Value} doesn't exist!");
            }
            await _repository.CreateAlbums(album);
        }

        public async Task<Albums?> GetAlbumsById(int id)
        { 
            var album = await _repository.GetAlbumsById(id);

            if (album == null)
                throw new BusinessException($"Album {id} doesn't exist!");

            return album == null ? null : album;
        }

        public async Task<IEnumerable<Albums>> GetAllAlbums()
        {
            var albums = await _repository.GetAllAlbums();
            return albums;
        }

        public async Task<IEnumerable<Albums>> GetAllArtistAlbums(int artistId)
        {
            if (await _artistRepository.GetArtistById(artistId) == null)
                throw new BusinessException($"Artist {artistId} doesn't exist!");

            var albums = await _repository.GetAllArtistAlbums(artistId);
            return albums;
        }

        public async Task<IEnumerable<Albums>> SearchAlbums(string searchQuery)
        {
            var albums = await _repository.SearchAlbums(searchQuery);
            return albums;
        }

        public async Task UpdateAlbums(Albums album)
        {
            if (await _artistRepository.GetArtistById(album.ArtistId.Value) == null)
                throw new BusinessException($"Artist {album.ArtistId.Value} doesn't exist!");
            
            await _repository.UpdateAlbums(album);
        }

        public async Task DeleteAlbums(int id)
        {
            if(await _repository.GetAlbumsById(id) == null)
                throw new BusinessException($"Album {id} doesn't exist!");

            await _repository.DeleteAlbums(id);
        }

        public async Task<IEnumerable<Songs>> GetAllAlbumSongs(int id)
        {
            return await _repository.GetAllAlbumSongs(id);
        }

        public async Task AddSongToAlbum(AlbumSongs albumSong)
        {
            if (await _repository.GetAlbumsById(albumSong.AlbumId) == null)
                throw new BusinessException($"Album {albumSong.AlbumId} doesn't exist!");

            if (await _songRepository.GetSongById(albumSong.SongId) == null)
                throw new BusinessException($"Song {albumSong.SongId} doesn't exist!");
           
            if (await _repository.GetAlbumSongPosition(albumSong.AlbumId, albumSong.SongId) != null)
                throw new BusinessException($"Song already exists in the album!");

            if (await _repository.CheckAlbumPosition(albumSong.AlbumId, albumSong.Position.Value))
                throw new BusinessException($"Position {albumSong.Position.Value} already taken!");
            
            await _repository.AddSongToAlbum(albumSong);
        }

        public async Task DeleteAlbumSong(int albumId, int songId)
        {
            if (await _repository.GetAlbumSongPosition(albumId, songId) == null)
                throw new BusinessException($"Song {songId} is not in album!");

            await _repository.DeleteAlbumSong(albumId, songId);
        }

        public async Task<int?> GetAlbumSongPosition(int albumId, int songId)
        {
            return await  _repository.GetAlbumSongPosition(albumId, songId);
        }

        public async Task<bool> CheckAlbumPosition(int albumId, int position)
        {
            return await _repository.CheckAlbumPosition(albumId, position);
        }

        public async Task UpdateAlbumSong(AlbumSongs albumSongs)
        {
            if (await _repository.GetAlbumsById(albumSongs.AlbumId) == null)
                throw new BusinessException($"Album {albumSongs.AlbumId} doesn't exist!");

            if (await _songRepository.GetSongById(albumSongs.SongId) == null)
                throw new BusinessException($"Song {albumSongs.SongId} doesn't exist!");

            if (await _repository.CheckAlbumPosition(albumSongs.AlbumId, albumSongs.Position.Value))
                throw new BusinessException($"Position already taken!");

            await _repository.UpdateAlbumSong(albumSongs);
        }

        public async Task<IEnumerable<Albums>> SearchAlbumsByGenre(string searchQuery)
        {
            return await _repository.SearchAlbumsByGenre(searchQuery);
        }
    }
}
