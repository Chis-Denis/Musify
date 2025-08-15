using Application.Contracts;
using Application.Interfaces;
using Application.UseCases;
using Domain.Entities;
using Moq;

namespace Musify.Tests.Controllers
{
    public static class ServiceMock
    {
        public static Mock<UserService> GetMock()
        {
            var mockRepo = new Mock<IUserRepository>();

            var seededUsers = new List<Users>
            {
                new Users { Id = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com", Token = "" },
                new Users { Id = 2, FirstName = "Jane", LastName = "Smith", Email = "jane@example.com", Token = "" },
            };

            mockRepo.Setup(r => r.GetAllUsers()).ReturnsAsync(seededUsers);
            mockRepo.Setup(r => r.GetUserById(1)).ReturnsAsync(seededUsers.First(u => u.Id == 1));
            mockRepo.Setup(r => r.GetUserByEmail("john@example.com")).ReturnsAsync(seededUsers.First(u => u.Email == "john@example.com"));
            mockRepo.Setup(r => r.GetUserByToken("")).ReturnsAsync(seededUsers.First(u => u.Id == 1));

            var service = new Mock<UserService>(mockRepo.Object);
            return service;
        }


        public static Mock<IPlaylistService> GetPlaylistServiceMock()
        {
            var seededPlaylists = new List<Playlists>
            {
                new Playlists
                {
                    Id = 1,
                    Name = "My Favourites",
                    UserId = 1,
                    Type = "public",
                    CreatedAt = System.DateTime.UtcNow.AddDays(-10),
                    UpdatedAt = System.DateTime.UtcNow.AddDays(-1),
                    PlaylistSongs = new List<PlaylistSongs>
                    {
                        new PlaylistSongs { PlaylistId = 1, SongId = 1, Position = 1 },
                        new PlaylistSongs { PlaylistId = 1, SongId = 2, Position = 2 }
                    },
                    PlaylistFollowers = new List<PlaylistFollowers>()
                },
                new Playlists
                {
                    Id = 2,
                    Name = "Chill Vibes",
                    UserId = 2,
                    Type = "private",
                    CreatedAt = System.DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = System.DateTime.UtcNow.AddDays(-2),
                    PlaylistSongs = new List<PlaylistSongs>
                    {
                        new PlaylistSongs { PlaylistId = 2, SongId = 3, Position = 1 }
                    },
                    PlaylistFollowers = new List<PlaylistFollowers>()
                }
            };

            var mockService = new Mock<IPlaylistService>();

            mockService.Setup(s => s.GetAllPlaylists()).ReturnsAsync(seededPlaylists);
            mockService.Setup(s => s.GetPlaylistById(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededPlaylists.FirstOrDefault(p => p.Id == id));
            mockService.Setup(s => s.GetPublicPlaylists())
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "public"));
            mockService.Setup(s => s.GetPrivatePlaylists())
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "private"));
            mockService.Setup(s => s.PlaylistExists(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededPlaylists.Any(p => p.Id == id));
            mockService.Setup(s => s.GetFollowedPlaylists(It.IsAny<int>()))
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "public"));
            mockService.Setup(s => s.SearchPlaylistsByName(It.IsAny<string>()))
                .ReturnsAsync((string name) => seededPlaylists.Where(p => p.Name != null && p.Name.Contains(name)));
            mockService.Setup(s => s.CreatePlaylist(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<string>()))
                .ReturnsAsync((string name, int userId, string type) =>
                    new Playlists { Id = 3, Name = name, UserId = userId, Type = type });
            mockService.Setup(s => s.UpdatePlaylistName(It.IsAny<int>(), It.IsAny<string>()))
                .Returns(Task.CompletedTask);
            mockService.Setup(s => s.DeletePlaylist(It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mockService.Setup(s => s.GetSongsInPlaylist(It.IsAny<int>()))
                .ReturnsAsync((int playlistId) =>
                    seededPlaylists.FirstOrDefault(p => p.Id == playlistId)?.PlaylistSongs ?? new List<PlaylistSongs>());
            mockService.Setup(s => s.AddSongToPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mockService.Setup(s => s.RemoveSongFromPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mockService.Setup(s => s.UpdatePlaylistSongsOrder(It.IsAny<int>(), It.IsAny<List<int>>()))
                .Returns(Task.CompletedTask);
            mockService.Setup(s => s.FollowPublicPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mockService.Setup(s => s.UnfollowPublicPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);
            mockService.Setup(s => s.AddAlbumToPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            return mockService;
        }

        public static Mock<ISongService> GetSongServiceMock()
        {
            var seededSongs = new List<Songs>
            {
                new Songs
                {
                    Id           = 1,
                    Title        = "Sunrise Serenade",
                    Duration     = TimeSpan.Parse("00:04:12"),
                    CreationDate = new DateTime(2020, 6, 15),
                    AlternativeTitles = new List<SongAlternativeTitles>
                    {
                        new SongAlternativeTitles {
                            Id               = 101,
                            SongId           = 1,
                            AlternativeTitle = "Aurore Sérénade",
                            Language         = "French"
                        },
                        new SongAlternativeTitles {
                            Id               = 102,
                            SongId           = 1,
                            AlternativeTitle = "Serenata del Alba",
                            Language         = "Spanish"
                        }
                    },
                    SongArtists = new List<SongArtists>
                    {
                        new SongArtists {
                            Id       = 201,
                            SongId   = 1,
                            ArtistId = 11,
                            Artist   = new Artists {
                                Id        = 11,
                                StageName = "Dawn Ensemble",
                                Type      = "band"
                            }
                        }
                    }
                },
                new Songs
                {
                    Id           = 2,
                    Title        = "Midnight Echoes",
                    Duration     = TimeSpan.Parse("00:05:03"),
                    CreationDate = new DateTime(2021, 1, 23),
                    AlternativeTitles = new List<SongAlternativeTitles>
                    {
                        new SongAlternativeTitles {
                            Id               = 103,
                            SongId           = 2,
                            AlternativeTitle = "Échos de Minuit",
                            Language         = "French"
                        },
                        new SongAlternativeTitles {
                            Id               = 104,
                            SongId           = 2,
                            AlternativeTitle = "Ecos de Medianoche",
                            Language         = "Spanish"
                        }
                    },
                    SongArtists = new List<SongArtists>
                    {
                        new SongArtists {
                            Id       = 202,
                            SongId   = 2,
                            ArtistId = 12,
                            Artist   = new Artists {
                                Id        = 12,
                                StageName = "Night Whispers",
                                Type      = "band"
                            }
                        }
                    }
                },
                new Songs
                {
                    Id           = 3,
                    Title        = "Ocean Whispers",
                    Duration     = TimeSpan.Parse("00:03:45"),
                    CreationDate = new DateTime(2019, 9, 5),
                    AlternativeTitles = new List<SongAlternativeTitles>
                    {
                        new SongAlternativeTitles {
                            Id               = 105,
                            SongId           = 3,
                            AlternativeTitle = "Murmures de l'Océan",
                            Language         = "French"
                        },
                        new SongAlternativeTitles {
                            Id               = 106,
                            SongId           = 3,
                            AlternativeTitle = "Susurros del Océano",
                            Language         = "Spanish"
                        }
                    },
                    SongArtists = new List<SongArtists>
                    {
                        new SongArtists {
                            Id       = 203,
                            SongId   = 3,
                            ArtistId = 13,
                            Artist   = new Artists {
                                Id        = 13,
                                StageName = "Wave Riders",
                                Type      = "band"
                            }
                        }
                    }
                },
                new Songs
                {
                    Id           = 4,
                    Title        = "City Lights",
                    Duration     = TimeSpan.Parse("00:04:55"),
                    CreationDate = new DateTime(2022, 3, 12),
                    AlternativeTitles = new List<SongAlternativeTitles>
                    {
                        new SongAlternativeTitles {
                            Id               = 107,
                            SongId           = 4,
                            AlternativeTitle = "Lumières de la Ville",
                            Language         = "French"
                        },
                        new SongAlternativeTitles {
                            Id               = 108,
                            SongId           = 4,
                            AlternativeTitle = "Luces de la Ciudad",
                            Language         = "Spanish"
                        }
                    },
                    SongArtists = new List<SongArtists>
                    {
                        new SongArtists {
                            Id       = 204,
                            SongId   = 4,
                            ArtistId = 14,
                            Artist   = new Artists {
                                Id        = 14,
                                StageName = "Urban Pulse",
                                Type      = "band"
                            }
                        }
                    }
                },
                new Songs
                {
                    Id           = 5,
                    Title        = "Desert Sunrise",
                    Duration     = TimeSpan.Parse("00:06:20"),
                    CreationDate = new DateTime(2020, 11, 30),
                    AlternativeTitles = new List<SongAlternativeTitles>
                    {
                        new SongAlternativeTitles {
                            Id               = 109,
                            SongId           = 5,
                            AlternativeTitle = "Lever de Soleil dans le Désert",
                            Language         = "French"
                        },
                        new SongAlternativeTitles {
                            Id               = 110,
                            SongId           = 5,
                            AlternativeTitle = "Amanecer en el Desierto",
                            Language         = "Spanish"
                        }
                    },
                    SongArtists = new List<SongArtists>
                    {
                        new SongArtists {
                            Id       = 205,
                            SongId   = 5,
                            ArtistId = 15,
                            Artist   = new Artists {
                                Id        = 15,
                                StageName = "Sandstorm Symphony",
                                Type      = "band"
                            }
                        }
                    }
                },
            };

            var mock = new Mock<ISongService>();

            mock.Setup(s => s.GetAllSongs())
                .ReturnsAsync(seededSongs.AsEnumerable());

            mock.Setup(s => s.GetSongById(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededSongs.FirstOrDefault(s => s.Id == id));

            mock.Setup(s => s.CreateSong(It.IsAny<Songs>()))
                .ReturnsAsync((Songs song) => { song.Id = seededSongs.Max(s => s.Id) + 1; return song; });

            mock.Setup(s => s.UpdateSong(It.IsAny<Songs>()))
                .Returns(Task.CompletedTask);

            mock.Setup(s => s.DeleteSong(It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(s => s.SearchSongsByName(It.IsAny<string>()))
                .ReturnsAsync((string name) => seededSongs.Where(s => s.Title.Contains(name)));

            mock.Setup(s => s.GetTrendingSongs())
                .ReturnsAsync(seededSongs.Take(3));

            mock.Setup(s => s.GetAllArtistSongs(It.IsAny<int>()))
                .ReturnsAsync((int artistId) => seededSongs.Where(s => s.SongArtists != null && s.SongArtists.Any(sa => sa.ArtistId == artistId)));

            mock.Setup(s => s.AddAlternativeTitles(It.IsAny<int>(), It.IsAny<List<SongAlternativeTitles>>()))
                .Returns(Task.CompletedTask);

            return mock;
        }
        public static Mock<ArtistService> GetArtistMock()
        {
            var mockRepo = new Mock<IArtistRepository>();

            var seededArtists = new List<Artists>
            {
                new Artists
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    StageName = "JD",
                    Type = "person",
                    ActiveStart = new DateTime(2010, 1, 1),
                    ActiveEnd = null
                },
                new Artists
                {
                    Id = 2,
                    BandName = "The Rockers",
                    Type = "band",
                    Location = "NY",
                    ActiveStart = new DateTime(2005, 1, 1),
                    ActiveEnd = null
                },
                new Artists
                {
                    Id = 3,
                    FirstName = "Emily",
                    LastName = "Stone",
                    StageName = "EmStone",
                    Type = "person",
                    ActiveStart = new DateTime(2012, 5, 1)
                }
            };

            mockRepo.Setup(r => r.GetAllArtists()).ReturnsAsync(seededArtists);

            var service = new Mock<ArtistService>(mockRepo.Object);
            return service;
        }

        public static Mock<AlbumService> GetAlbumMock()
        {
            var mock = new Mock<IAlbumRepository>();

            var seededAlbums = new List<Albums>
            {
                new Albums
                {
                    Id = 1,
                    Title = "Debut Album",
                    Description = "First release",
                    Genre = "Pop",
                    ArtistId = 1,
                    ReleaseDate = new DateTime(2021, 3, 1),
                    Label = "Universal"
                },
                new Albums
                {
                    Id = 2,
                    Title = "Night Sparks",
                    Description = "Second release",
                    Genre = "Electronic",
                    ArtistId = 4,
                    ReleaseDate = new DateTime(2023, 10, 15),
                    Label = "ElectroBeat"
                }
            };

            var seededSongs = new List<Songs>
            {
                new Songs { Id = 1, Title = "Song A", Duration = new TimeSpan(0, 3, 30), CreationDate = new DateTime(2021, 1, 1) },
                new Songs { Id = 2, Title = "Midnight Fire", Duration = new TimeSpan(0, 4, 15), CreationDate = new DateTime(2023, 6, 12) },
                new Songs { Id = 3, Title = "Rise Again", Duration = new TimeSpan(0, 2, 58), CreationDate = new DateTime(2022, 11, 20) }
            };

            var albumSongs = new List<AlbumSongs>
            {
                new AlbumSongs { Id = 1, AlbumId = 1, SongId = 1, Position = 1 },
                new AlbumSongs { Id = 2, AlbumId = 2, SongId = 2, Position = 1 },
                new AlbumSongs { Id = 3, AlbumId = 2, SongId = 3, Position = 2 }
            };

            mock.Setup(r => r.GetAllAlbums()).ReturnsAsync(seededAlbums);
            mock.Setup(r => r.GetAllArtistAlbums(4)).ReturnsAsync(seededAlbums.Where(a => a.ArtistId == 4));
            mock.Setup(r => r.GetAllAlbumSongs(2))
                .ReturnsAsync(albumSongs.Where(asg => asg.AlbumId == 2)
                    .Select(asg => seededSongs.First(s => s.Id == asg.SongId)));
            mock.Setup(r => r.GetAlbumsById(1)).ReturnsAsync(seededAlbums.First(a => a.Id == 1));
            mock.Setup(r => r.SearchAlbums("Debut")).ReturnsAsync(seededAlbums.Where(a => a.Title.Contains("Debut")));
            mock.Setup(r => r.SearchAlbumsByGenre("Pop")).ReturnsAsync(seededAlbums.Where(a => a.Genre == "Pop"));
            mock.Setup(r => r.GetAlbumSongPosition(2, 3)).ReturnsAsync(albumSongs.First(asg => asg.AlbumId == 2 && asg.SongId == 3).Position);
            mock.Setup(r => r.CheckAlbumPosition(2, 2)).ReturnsAsync(albumSongs.Any(asg => asg.AlbumId == 2 && asg.Position == 2));

            var service = new Mock<AlbumService>(mock.Object);
            return service;
        }
    }
}
