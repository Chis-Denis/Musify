using Application.Contracts;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Musify.Tests.Repositories
{
    public class AlbumRepositoryTests : IDisposable
    {
        private readonly MusifyDbContext _context;
        private readonly IAlbumRepository _repository;

        public AlbumRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<MusifyDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new MusifyDbContext(options);
            _repository = new AlbumRepository(_context);

            SeedData().Wait();
        }

        private async Task SeedData()
        {
            var album1 = new Albums { 
                Id = 1, 
                Title = "Debut Album",
                Description = "First release",
                Genre = "Pop",
                ArtistId = 1, 
                ReleaseDate = new DateTime(2021, 3, 1),
                Label = "Universal" 
            };

            var album2 = new Albums { 
                Id = 2, 
                Title = "Night Sparks", 
                Description = "Second release",
                Genre = "Electronic", 
                ArtistId = 4, 
                ReleaseDate = new DateTime(2023, 10, 15), 
                Label = "ElectroBeat" 
            };

            var song1 = new Songs {
                Id = 1, 
                Title = "Song A",
                Duration = new TimeSpan(0, 3, 30), 
                CreationDate = new DateTime(2021, 1, 1) 
            };
            var song2 = new Songs { 
                Id = 2, 
                Title = "Midnight Fire", 
                Duration = new TimeSpan(0, 4, 15), 
                CreationDate = new DateTime(2023, 6, 12) 
            };
            var song3 = new Songs {
                Id = 3, 
                Title = "Rise Again",
                Duration = new TimeSpan(0, 2, 58),
                CreationDate = new DateTime(2022, 11, 20) 
            };

            var albumSong1 = new AlbumSongs { 
                Id = 1,
                AlbumId = 1, 
                SongId = 1,
                Position = 1
            };
            var albumSong2 = new AlbumSongs {
                Id = 2,
                AlbumId = 2, 
                SongId = 2, 
                Position = 1
            };
            var albumSong3 = new AlbumSongs { 
                Id = 3, 
                AlbumId = 2, 
                SongId = 3,
                Position = 2 
            };

            _context.Albums.AddRange(album1, album2);
            _context.Songs.AddRange(song1, song2, song3);
            _context.AlbumSongs.AddRange(albumSong1, albumSong2, albumSong3);
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task Should_Return_All_Albums()
        {
            var albums =  await _repository.GetAllAlbums();

            Assert.Equal(2, albums.Count());
            Assert.Contains(albums, a => a.Title == "Debut Album");
            Assert.Contains(albums, a => a.Title == "Night Sparks");
        }

        [Fact]
        public async Task Should_Return_Artist_Album()
        {
            var albums = await _repository.GetAllArtistAlbums(1);

            Assert.Single(albums);
            Assert.Contains(albums, a => a.Title == "Debut Album");
        }

        [Fact]
        public async Task Should_Search_Albums_By_Title()
        {
            var result = await _repository.SearchAlbums("Night");

            Assert.Single(result);
            Assert.Equal("Night Sparks", result.First().Title);
        }

        [Fact]
        public async Task Should_Search_Albums_By_Genre()
        {
            var result = await _repository.SearchAlbumsByGenre("Pop");

            Assert.Single(result);
            Assert.Equal("Debut Album", result.First().Title);
        }

        [Fact]
        public async Task Should_Return_Album_By_Id()
        {
            var album = await _repository.GetAlbumsById(1);

            Assert.NotNull(album);
            Assert.Equal("Debut Album", album.Title);
        }

        [Fact]
        public async Task Should_Create_New_Album()
        {
            var newAlbum = new Albums
            {
                Title = "Future Sounds",
                Description = "Electro vibes",
                Genre = "Electronic",
                ArtistId = 2,
                ReleaseDate = new DateTime(2024, 5, 10),
                Label = "SynthWave"
            };

            await _repository.CreateAlbums(newAlbum);
            var albums = await _repository.GetAllAlbums();

            Assert.Equal(3, albums.Count());
            Assert.Contains(albums, a => a.Title == "Future Sounds");
        }

        [Fact]
        public async Task Should_Update_Album()
        {
            var album = await _repository.GetAlbumsById(1);
            album.Title = "Updated Debut";

            await _repository.UpdateAlbums(album);
            var updated = await _repository.GetAlbumsById(1);

            Assert.Equal("Updated Debut", updated.Title);
        }

        [Fact]
        public async Task Should_Delete_Album()
        {
            await _repository.DeleteAlbums(1);

            var result = await _repository.GetAlbumsById(1);
            Assert.Null(result);

            var all = await _repository.GetAllAlbums();
            Assert.Single(all);
        }

        [Fact]
        public async Task Should_Return_Songs_Of_Specific_Album_In_Order()
        {
            var songs = await _repository.GetAllAlbumSongs(2); 

            Assert.Equal(2, songs.Count());
            Assert.Equal("Midnight Fire", songs.ElementAt(0).Title);
            Assert.Equal("Rise Again", songs.ElementAt(1).Title);
        }

        [Fact]
        public async Task Should_Return_True_If_Position_Exists_In_Album()
        {
            var exists = await _repository.CheckAlbumPosition(2, 1);

            Assert.True(exists);
        }

        [Fact]
        public async Task Should_Return_False_If_Position_Does_Not_Exist()
        {
            var exists = await _repository.CheckAlbumPosition(2, 5); 

            Assert.False(exists);
        }

        [Fact]
        public async Task Should_Return_Position_Of_Song_In_Album()
        {
            var position = await _repository.GetAlbumSongPosition(2, 3);

            Assert.Equal(2, position);
        }

        [Fact]
        public async Task Should_Return_Null_For_Nonexistent_AlbumSong()
        {
            var position = await _repository.GetAlbumSongPosition(1, 99);

            Assert.Null(position);
        }

        [Fact]
        public async Task Should_Add_Song_To_Album()
        {
            var newLink = new AlbumSongs
            {
                AlbumId = 1,
                SongId = 3, 
                Position = 2
            };

            await _repository.AddSongToAlbum(newLink);
            var songs = await _repository.GetAllAlbumSongs(1);

            Assert.Equal(2, songs.Count());
            Assert.Equal("Rise Again", songs.Last().Title);
        }

        [Fact]
        public async Task Should_Delete_AlbumSong_Relation()
        {
            await _repository.DeleteAlbumSong(2, 2);

            var songs = await _repository.GetAllAlbumSongs(2);
            Assert.Single(songs);
            Assert.DoesNotContain(songs, s => s.Id == 2);
        }

        [Fact]
        public async Task Should_Update_AlbumSong_Position()
        {
            var albumSong = await _context.AlbumSongs
        .FirstOrDefaultAsync(asg => asg.AlbumId == 2 && asg.SongId == 2);
            albumSong.Position = 5;

            await _repository.UpdateAlbumSong(albumSong);

            var updated = await _repository.GetAlbumSongPosition(2, 2);
            Assert.Equal(5, updated);
        }

    }
}
