using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.Data
{
    public class MusifyDbContext : DbContext
    {
        public MusifyDbContext(DbContextOptions<MusifyDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Songs> Songs { get; set; }
        public DbSet<Albums> Albums { get; set; }
        public DbSet<Playlists> Playlists { get; set; }
        public DbSet<Artists> Artists { get; set; }

        public DbSet<SongArtists> SongArtists { get; set; }
        public DbSet<SongAlternativeTitles> SongAlternativeTitles { get; set; }
        public DbSet<AlbumSongs> AlbumSongs { get; set; }
        public DbSet<PlaylistSongs> PlaylistSongs { get; set; }
        public DbSet<PlaylistFollowers> PlaylistFollowers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(u => u.Id);

                entity.Property(u => u.FirstName)
                      .HasMaxLength(100);

                entity.Property(u => u.LastName)
                      .HasMaxLength(100);

                entity.Property(u => u.Email)
                      .HasMaxLength(255)
                      .IsRequired();

                entity.HasIndex(u => u.Email)
                      .IsUnique();

                entity.Property(u => u.PasswordHash)
                      .HasMaxLength(255)
                      .IsRequired();

                entity.Property(u => u.Country)
                      .HasMaxLength(100);

                entity.Property(u => u.Role)
                      .HasMaxLength(10)
                      .IsRequired();

                entity.Property(u => u.IsActive)
                      .HasDefaultValue(true);

                entity.Property(u => u.IsDeleted)
                      .HasDefaultValue(false);

                entity.Property(u => u.Token)
                      .HasMaxLength(1000);
            });

            modelBuilder.Entity<Users>().HasQueryFilter(u => !u.IsDeleted);

            modelBuilder.Entity<Songs>(entity =>
            {
                entity.ToTable("Songs");

                entity.HasKey(s => s.Id);

                entity.Property(s => s.Title)
                      .HasMaxLength(255)
                      .IsRequired();

                entity.Property(s => s.Duration)
                      .HasColumnType("time");

                entity.Property(s => s.CreationDate)
                      .HasColumnType("date");
            });

            modelBuilder.Entity<Albums>(entity =>
            {
                entity.ToTable("Albums");

                entity.HasKey(a => a.Id);

                entity.Property(a => a.Title)
                      .HasMaxLength(255)
                      .IsRequired();

                entity.Property(a => a.Description)
                      .HasColumnType("varchar(max)");

                entity.Property(a => a.Genre)
                      .HasMaxLength(100);

                entity.Property(a => a.ReleaseDate)
                      .HasColumnType("date");

                entity.Property(a => a.Label)
                      .HasMaxLength(255);

                entity.HasOne(a => a.Artist)
                      .WithMany(ar => ar.Albums)
                      .HasForeignKey(a => a.ArtistId);
            });

            modelBuilder.Entity<Playlists>(entity =>
            {
                entity.ToTable("Playlists");

                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name)
                      .HasMaxLength(255);

                entity.Property(p => p.Type)
                      .HasMaxLength(10)
                      .IsRequired();

                entity.Property(p => p.CreatedAt)
                      .HasDefaultValueSql("GETDATE()");

                entity.Property(p => p.UpdatedAt)
                      .HasDefaultValueSql("GETDATE()");

                entity.HasOne(p => p.User)
                      .WithMany(u => u.Playlists)
                      .HasForeignKey(p => p.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Artists>(entity =>
            {
                entity.ToTable("Artists");

                entity.HasKey(a => a.Id);

                entity.Property(a => a.StageName)
                      .HasMaxLength(255);

                entity.Property(a => a.BandName)
                      .HasMaxLength(255);

                entity.Property(a => a.Location)
                      .HasMaxLength(255);

                entity.Property(a => a.Type)
                      .HasMaxLength(10)
                      .IsRequired();

                entity.Property(a => a.FirstName)
                      .HasMaxLength(100);

                entity.Property(a => a.LastName)
                      .HasMaxLength(100);

                entity.Property(a => a.Birthday)
                      .HasColumnType("date");

                entity.Property(a => a.ActiveStart)
                      .HasColumnType("date");

                entity.Property(a => a.ActiveEnd)
                      .HasColumnType("date");
            });

            modelBuilder.Entity<Artists>()
                .HasMany(a => a.Members)
                .WithMany(a => a.Bands)
                .UsingEntity(j => j.ToTable("ArtistsArtists"));
            

            modelBuilder.Entity<SongArtists>(entity =>
            {
                entity.ToTable("SongArtists");

                entity.HasKey(sa => sa.Id);

                entity.HasOne(sa => sa.Song)
                      .WithMany(s => s.SongArtists)
                      .HasForeignKey(sa => sa.SongId);

                entity.HasOne(sa => sa.Artist)
                      .WithMany(a => a.SongArtists)
                      .HasForeignKey(sa => sa.ArtistId);
            });

            modelBuilder.Entity<SongAlternativeTitles>(entity =>
            {
                entity.ToTable("SongAlternativeTitles");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.AlternativeTitle).HasMaxLength(255);
                entity.Property(x => x.Language).HasMaxLength(100);

                entity.HasOne(x => x.Song)
                      .WithMany(s => s.AlternativeTitles)
                      .HasForeignKey(x => x.SongId);
            });

            modelBuilder.Entity<AlbumSongs>(entity =>
            {
                entity.ToTable("AlbumSongs");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Position);

                entity.HasOne(x => x.Album)
                      .WithMany(a => a.AlbumSongs)
                      .HasForeignKey(x => x.AlbumId);

                entity.HasOne(x => x.Song)
                      .WithMany(s => s.AlbumSongs)
                      .HasForeignKey(x => x.SongId);
            });


            modelBuilder.Entity<PlaylistSongs>(entity =>
            {
                entity.ToTable("PlaylistSongs");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Position);

                entity.HasOne(x => x.Playlist)
                      .WithMany(p => p.PlaylistSongs)
                      .HasForeignKey(x => x.PlaylistId);

                entity.HasOne(x => x.Song)
                      .WithMany(s => s.PlaylistSongs)
                      .HasForeignKey(x => x.SongId);
            });

            modelBuilder.Entity<PlaylistFollowers>(entity =>
            {
                entity.ToTable("PlaylistFollowers");

                entity.HasKey(pf => pf.Id);

                entity.HasOne(pf => pf.User)
                      .WithMany(u => u.PlaylistFollowers)
                      .HasForeignKey(pf => pf.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(pf => pf.Playlist)
                      .WithMany(p => p.PlaylistFollowers)
                      .HasForeignKey(pf => pf.PlaylistId);
            });

            DbSeeder.Seed(modelBuilder);

        }
    }
}
