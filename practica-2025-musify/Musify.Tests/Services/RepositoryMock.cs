using Application.Contracts;
using Domain.Entities;
using Moq;

namespace Musify.Tests.Services
{
    public static class RepositoryMock
    {
        public static Mock<IUserRepository> GetMock()
        {
            var mock = new Mock<IUserRepository>();

            var seededUsers = new List<Users>
            {
                new Users { Id = 1, FirstName = "John", LastName = "Doe", Email = "john@example.com", Token = "" },
                new Users { Id = 2, FirstName = "Jane", LastName = "Smith", Email = "jane@example.com", Token = "" },
            };

            mock.Setup(r => r.GetAllUsers()).ReturnsAsync(seededUsers);
            mock.Setup(r => r.GetUserById(1)).ReturnsAsync(seededUsers.First(u => u.Id == 1));
            mock.Setup(r => r.GetUserByEmail("john@example.com")).ReturnsAsync(seededUsers.First(u => u.Email == "john@example.com"));
            mock.Setup(r => r.GetUserByToken("")).ReturnsAsync(seededUsers.First(u => u.Id == 1));

            return mock;
        }

        public static Mock<ISongRepository> GetMockSongRepository()
        {
            var mock = new Mock<ISongRepository>();

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

            mock.Setup(r => r.GetAllSongs())
                .ReturnsAsync(seededSongs);

            mock.Setup(r => r.GetSongById(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededSongs.Find(s => s.Id == id));

            mock.Setup(r => r.AddSong(It.IsAny<Songs>()))
                .ReturnsAsync((Songs song) =>
                {
                    song.Id = seededSongs.Max(s => s.Id) + 1;
                    seededSongs.Add(song);
                    return song;
                });

            mock.Setup(r => r.UpdateSong(It.IsAny<Songs>()))
                .Returns(Task.CompletedTask)
                .Callback<Songs>(song =>
                {
                    var idx = seededSongs.FindIndex(s => s.Id == song.Id);
                    if (idx >= 0) seededSongs[idx].Title = song.Title;
                });

            mock.Setup(r => r.DeleteSong(It.IsAny<Songs>()))
                .Returns<Songs>(toDelete =>
                {
                    var existing = seededSongs.FirstOrDefault(s => s.Id == toDelete.Id);
                    if (existing != null)
                        seededSongs.Remove(existing);
                    return Task.CompletedTask;
                });

            mock.Setup(r => r.SearchSongsByName(It.IsAny<string>()))
                .ReturnsAsync((string name) =>
                    seededSongs
                        .Where(s => s.Title.Contains(name, StringComparison.OrdinalIgnoreCase)
                                    || s.AlternativeTitles.Any(at =>
                                        at.AlternativeTitle?.Contains(name, StringComparison.OrdinalIgnoreCase) == true))
                        .ToList()
                );

            mock.Setup(r => r.GetTrendingSongs())
                .ReturnsAsync(() => seededSongs
                    .OrderByDescending(s => s.PlaylistSongs.Count)
                    .Take(3)
                    .ToList()
                );

            mock.Setup(r => r.GetSongByIdWithArtists(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededSongs
                    .FirstOrDefault(s => s.Id == id)
                );

            mock.Setup(r => r.GetByIdWithAlternatives(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededSongs
                    .FirstOrDefault(s => s.Id == id)
                );

            mock.Setup(r => r.SaveChanges())
                .Returns(Task.CompletedTask);

            return mock;
        }

        public static Mock<IPlaylistRepository> GetPlaylistMock()
        {
            var mock = new Mock<IPlaylistRepository>();

            var seededPlaylists = new List<Playlists>
                {
                    new Playlists
                    {
                        Id = 1,
                        Name = "My Favourites",
                        Type = "public",
                        UserId = 1,
                        PlaylistSongs = new List<PlaylistSongs>
                        {
                            new PlaylistSongs { Id = 1, PlaylistId = 1, SongId = 101, Position = 1 },
                            new PlaylistSongs { Id = 2, PlaylistId = 1, SongId = 102, Position = 2 }
                        },
                        PlaylistFollowers = new List<PlaylistFollowers>()
                    },
                    new Playlists
                    {
                        Id = 2,
                        Name = "Chill Vibes",
                        Type = "private",
                        UserId = 2,
                        PlaylistSongs = new List<PlaylistSongs>(),
                        PlaylistFollowers = new List<PlaylistFollowers>()
                    }
                };

            var seededAlbums = new List<Albums>
                {
                    new Albums { Id = 1, Title = "Test Album" }
                };


            mock.Setup(r => r.GetAllPlaylists()).ReturnsAsync(seededPlaylists);

            mock.Setup(r => r.GetPlaylistById(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededPlaylists.FirstOrDefault(p => p.Id == id));

            mock.Setup(r => r.CreatePlaylist(It.IsAny<Playlists>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.UpdatePlaylist(It.IsAny<Playlists>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.DeletePlaylist(It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.GetSongsInPlaylist(It.Is<int>(id => id == 1))).ReturnsAsync((int playlistId) =>
            {
                var baseSongs = seededPlaylists.FirstOrDefault(p => p.Id == playlistId)?.PlaylistSongs ?? new List<PlaylistSongs>();
              
                if (baseSongs.All(ps => ps.SongId != 999))
                    return baseSongs;
                return new List<PlaylistSongs>();
            });

            mock.Setup(r => r.GetAlbumWithSongs(2)).ReturnsAsync(new Albums
            {
                Id = 2,
                AlbumSongs = new List<AlbumSongs> { new AlbumSongs { SongId = 999 } }
            });

            mock.Setup(r => r.AddSongToPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.RemoveSongFromPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.RemoveAlbumFromPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.GetAlbumsFromPlaylist(It.IsAny<int>()))
                .ReturnsAsync(seededAlbums);

            mock.Setup(r => r.AlbumExists(It.IsAny<int>()))
                .ReturnsAsync((int albumId) => seededAlbums.Any(a => a.Id == albumId));

            mock.Setup(r => r.GetAlbumWithSongs(It.IsAny<int>()))
                .ReturnsAsync((int albumId) => seededAlbums.FirstOrDefault(a => a.Id == albumId));

            mock.Setup(r => r.AddAlbumSongsToPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.GetPrivatePlaylists())
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "private"));

            mock.Setup(r => r.GetPublicPlaylists())
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "public"));

            mock.Setup(r => r.PlaylistExists(It.IsAny<int>()))
                .ReturnsAsync((int id) => seededPlaylists.Any(p => p.Id == id));

            mock.Setup(r => r.GetFollowedPlaylists(It.IsAny<int>()))
                .ReturnsAsync(seededPlaylists.Where(p => p.Type == "public"));

            mock.Setup(r => r.UpdatePlaylistSongsOrder(It.IsAny<IEnumerable<PlaylistSongs>>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.FollowPublicPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.UnfollowPublicPlaylist(It.IsAny<int>(), It.IsAny<int>()))
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.SaveChanges())
                .Returns(Task.CompletedTask);

            mock.Setup(r => r.SearchPlaylistsByName(It.IsAny<string>()))
                .ReturnsAsync((string name) =>
                    seededPlaylists.Where(p => p.Name != null && p.Name.Contains(name)));

            return mock;
        }

        public static Mock<IArtistRepository> GetArtistMock()
        {
            var mock = new Mock<IArtistRepository>();

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

            mock.Setup(r => r.GetAll()).ReturnsAsync(seededArtists);

            mock.Setup(r => r.GetAllArtists()).ReturnsAsync(seededArtists.Where(a => a.Type == "person"));

            mock.Setup(r => r.GetAllBands()).ReturnsAsync(seededArtists.Where(a => a.Type == "band"));

            mock.Setup(r => r.GetArtistById(It.IsAny<int>())).ReturnsAsync((int id) => seededArtists.FirstOrDefault(a => a.Id == id));

            mock.Setup(r => r.AddArtist(It.IsAny<Artists>())).Callback<Artists>(artist => seededArtists.Add(artist)).Returns(Task.CompletedTask);

            mock.Setup(r => r.UpdateArtist(It.IsAny<Artists>())).Returns(Task.CompletedTask);

            mock.Setup(r => r.DeleteArtist(It.IsAny<Artists>())).Callback<Artists>(artist => seededArtists.Remove(artist)).Returns(Task.CompletedTask);

            mock.Setup(r => r.AddBandMember(It.IsAny<Artists>(), It.IsAny<Artists>())).Returns(Task.CompletedTask);

            mock.Setup(r => r.RemoveBandMember(It.IsAny<Artists>(), It.IsAny<Artists>())).Returns(Task.CompletedTask);

            mock.Setup(r => r.Search(It.IsAny<string>()))
                .ReturnsAsync((string name) =>
                    seededArtists.Where(a =>
                        (a.StageName != null && a.StageName.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                        (a.BandName != null && a.BandName.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                        (a.FirstName != null && a.FirstName.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                        (a.LastName != null && a.LastName.Contains(name, StringComparison.OrdinalIgnoreCase))
                    ));

            return mock;
        }

        public static Mock<IAlbumRepository> GetAlbumMock()
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

            return mock;
        }
    }
}
