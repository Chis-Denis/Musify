using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Artists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StageName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    BandName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Birthday = table.Column<DateTime>(type: "date", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ActiveStart = table.Column<DateTime>(type: "date", nullable: true),
                    ActiveEnd = table.Column<DateTime>(type: "date", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Artists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Songs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Duration = table.Column<TimeSpan>(type: "time", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Songs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Token = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Albums",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "varchar(max)", nullable: true),
                    ArtistId = table.Column<int>(type: "int", nullable: true),
                    Genre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ReleaseDate = table.Column<DateTime>(type: "date", nullable: true),
                    Label = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Albums", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Albums_Artists_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "Artists",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ArtistsArtists",
                columns: table => new
                {
                    BandsId = table.Column<int>(type: "int", nullable: false),
                    MembersId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArtistsArtists", x => new { x.BandsId, x.MembersId });
                    table.ForeignKey(
                        name: "FK_ArtistsArtists_Artists_BandsId",
                        column: x => x.BandsId,
                        principalTable: "Artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArtistsArtists_Artists_MembersId",
                        column: x => x.MembersId,
                        principalTable: "Artists",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SongAlternativeTitles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SongId = table.Column<int>(type: "int", nullable: false),
                    AlternativeTitle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Language = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongAlternativeTitles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SongAlternativeTitles_Songs_SongId",
                        column: x => x.SongId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SongArtists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SongId = table.Column<int>(type: "int", nullable: false),
                    ArtistId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongArtists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SongArtists_Artists_ArtistId",
                        column: x => x.ArtistId,
                        principalTable: "Artists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SongArtists_Songs_SongId",
                        column: x => x.SongId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Playlists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playlists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Playlists_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AlbumSongs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlbumId = table.Column<int>(type: "int", nullable: false),
                    SongId = table.Column<int>(type: "int", nullable: false),
                    Position = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlbumSongs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlbumSongs_Albums_AlbumId",
                        column: x => x.AlbumId,
                        principalTable: "Albums",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlbumSongs_Songs_SongId",
                        column: x => x.SongId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlaylistFollowers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PlaylistId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaylistFollowers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlaylistFollowers_Playlists_PlaylistId",
                        column: x => x.PlaylistId,
                        principalTable: "Playlists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlaylistFollowers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PlaylistSongs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlaylistId = table.Column<int>(type: "int", nullable: false),
                    SongId = table.Column<int>(type: "int", nullable: false),
                    Position = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaylistSongs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlaylistSongs_Playlists_PlaylistId",
                        column: x => x.PlaylistId,
                        principalTable: "Playlists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlaylistSongs_Songs_SongId",
                        column: x => x.SongId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Artists",
                columns: new[] { "Id", "ActiveEnd", "ActiveStart", "BandName", "Birthday", "FirstName", "LastName", "Location", "StageName", "Type" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2010, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1990, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Alice", "Smith", null, "Alice", "person" },
                    { 2, null, new DateTime(2018, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1995, 8, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "Luma", "Gray", null, "Luma", "person" },
                    { 3, null, new DateTime(2014, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1992, 2, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Max", "Thorne", null, "Max", "person" },
                    { 4, null, new DateTime(2013, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1991, 12, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Zane", "Black", null, "Zane", "person" },
                    { 5, null, new DateTime(2010, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1989, 7, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Rico", "Vega", null, "Rico", "person" },
                    { 6, null, new DateTime(2017, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1996, 11, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lara", "Stone", null, "Lara", "person" },
                    { 7, null, new DateTime(2012, 11, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1994, 6, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Noah", "Cross", null, "Noah", "person" },
                    { 8, null, new DateTime(2011, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1993, 4, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Elina", "Ray", null, "Elina", "person" },
                    { 9, null, new DateTime(2019, 8, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1997, 10, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Kai", "Wells", null, "Kai", "person" },
                    { 10, null, new DateTime(2012, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1993, 3, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Maya", "Singh", null, "Maya", "person" },
                    { 11, null, new DateTime(2015, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1995, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sofia", "Costa", null, "Sofia", "person" },
                    { 12, null, new DateTime(2010, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1990, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ivan", "Ivanov", null, "Ivan", "person" },
                    { 13, null, new DateTime(2012, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1992, 9, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lea", "Dubois", null, "Lea", "person" },
                    { 14, null, new DateTime(2011, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1991, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Diego", "Fernandez", null, "Diego", "person" },
                    { 15, null, new DateTime(2016, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1996, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Hana", "Yamamoto", null, "Hana", "person" },
                    { 16, null, new DateTime(2013, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1993, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "William", "Brown", null, "William", "person" },
                    { 17, null, new DateTime(2014, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1994, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chen", "Wei", null, "Chen", "person" },
                    { 18, null, new DateTime(2012, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1992, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Fatima", "Al-Farsi", null, "Fatima", "person" },
                    { 19, null, new DateTime(2011, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1991, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lucas", "Silva", null, "Lucas", "person" },
                    { 20, null, new DateTime(2015, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1995, 4, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Priya", "Sharma", null, "Priya", "person" },
                    { 21, null, new DateTime(2013, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1993, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Anna", "Kowalska", null, "Anna", "person" },
                    { 22, null, new DateTime(2012, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1992, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sven", "Larsen", null, "Sven", "person" },
                    { 23, null, new DateTime(2014, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1994, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Marta", "Garcia", null, "Marta", "person" },
                    { 24, null, new DateTime(2011, 11, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1991, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Omar", "Said", null, "Omar", "person" },
                    { 25, null, new DateTime(2016, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1996, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sophia", "Rossi", null, "Sophia", "person" },
                    { 26, null, new DateTime(2012, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1992, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "David", "Goldberg", null, "David", "person" },
                    { 27, null, new DateTime(2015, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1995, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ava", "Nguyen", null, "Ava", "person" },
                    { 28, null, new DateTime(2013, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1993, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mateo", "Gonzalez", null, "Mateo", "person" },
                    { 29, null, new DateTime(2014, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1994, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Julia", "Novak", null, "Julia", "person" },
                    { 30, null, new DateTime(2012, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1992, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Peter", "Novak", null, "Peter", "person" },
                    { 31, null, new DateTime(2011, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1991, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Linda", "Müller", null, "Linda", "person" },
                    { 32, null, new DateTime(2010, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1990, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "George", "Papadopoulos", null, "George", "person" },
                    { 33, null, new DateTime(2016, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1996, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Isabella", "Martinez", null, "Isabella", "person" },
                    { 34, null, new DateTime(2013, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1993, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mohammed", "Al-Masri", null, "Mohammed", "person" },
                    { 35, null, new DateTime(2012, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, new DateTime(1992, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Emily", "Johnson", null, "Emily", "person" },
                    { 36, null, new DateTime(2005, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Delta Band", null, null, null, "New York", "Delta Band", "band" },
                    { 37, null, new DateTime(2012, 9, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sonic Boom", null, null, null, "Los Angeles", "Sonic Boom", "band" },
                    { 38, null, new DateTime(2016, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Neon Pulse", null, null, null, "London", "Neon Pulse", "band" },
                    { 39, null, new DateTime(2020, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Crystal Echo", null, null, null, "Berlin", "Crystal Echo", "band" },
                    { 40, null, new DateTime(2018, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Blue Horizon", null, null, null, "Sydney", "Blue Horizon", "band" },
                    { 41, null, new DateTime(2015, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Red Velvet", null, null, null, "Seoul", "Red Velvet", "band" },
                    { 42, null, new DateTime(2017, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Golden Strings", null, null, null, "Vienna", "Golden Strings", "band" },
                    { 43, null, new DateTime(2019, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Urban Groove", null, null, null, "Toronto", "Urban Groove", "band" },
                    { 44, null, new DateTime(2014, 11, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Silver Wave", null, null, null, "Cape Town", "Silver Wave", "band" },
                    { 45, null, new DateTime(2013, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Electric Dream", null, null, null, "San Francisco", "Electric Dream", "band" },
                    { 46, null, new DateTime(2016, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Desert Rose", null, null, null, "Dubai", "Desert Rose", "band" },
                    { 47, null, new DateTime(2018, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Northern Lights", null, null, null, "Oslo", "Northern Lights", "band" },
                    { 48, null, new DateTime(2017, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sunset Riders", null, null, null, "Los Angeles", "Sunset Riders", "band" },
                    { 49, null, new DateTime(2015, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Firefly", null, null, null, "Rio de Janeiro", "Firefly", "band" },
                    { 50, null, new DateTime(2019, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Echoes", null, null, null, "London", "Echoes", "band" }
                });

            migrationBuilder.InsertData(
                table: "Songs",
                columns: new[] { "Id", "CreationDate", "Duration", "Title" },
                values: new object[,]
                {
                    { 1, new DateTime(2021, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 30, 0), "Midnight Sun" },
                    { 2, new DateTime(2021, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 15, 0), "Golden Hour" },
                    { 3, new DateTime(2021, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 2, 58, 0), "Neon Dreams" },
                    { 4, new DateTime(2021, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 50, 0), "Crystal River" },
                    { 5, new DateTime(2021, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 5, 0), "Electric Sky" },
                    { 6, new DateTime(2021, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 40, 0), "Desert Mirage" },
                    { 7, new DateTime(2021, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 0, 0), "Blue Lagoon" },
                    { 8, new DateTime(2021, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 55, 0), "Urban Pulse" },
                    { 9, new DateTime(2021, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 10, 0), "Silver Lining" },
                    { 10, new DateTime(2021, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 45, 0), "Firefly Nights" },
                    { 11, new DateTime(2021, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 20, 0), "Sunset Drive" },
                    { 12, new DateTime(2021, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 12, 0), "Northern Lights" },
                    { 13, new DateTime(2022, 1, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 33, 0), "Echoes of You" },
                    { 14, new DateTime(2022, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 44, 0), "Red Velvet Road" },
                    { 15, new DateTime(2022, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 1, 0), "Dancing Shadows" },
                    { 16, new DateTime(2022, 4, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 29, 0), "Dreamscape" },
                    { 17, new DateTime(2022, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 59, 0), "Silver Wave" },
                    { 18, new DateTime(2022, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 7, 0), "Urban Groove" },
                    { 19, new DateTime(2022, 7, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 36, 0), "Crystal Echo" },
                    { 20, new DateTime(2022, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 2, 0), "Golden Era" },
                    { 21, new DateTime(2022, 9, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 41, 0), "Blue Moon" },
                    { 22, new DateTime(2022, 10, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 8, 0), "Desert Rose" },
                    { 23, new DateTime(2022, 11, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 27, 0), "Focus Mode" },
                    { 24, new DateTime(2022, 12, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 53, 0), "Throwback Jams" },
                    { 25, new DateTime(2023, 1, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 6, 0), "Workout Boost" },
                    { 26, new DateTime(2023, 2, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 38, 0), "Party Hits" },
                    { 27, new DateTime(2023, 3, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 3, 0), "Chill Vibes" },
                    { 28, new DateTime(2023, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 49, 0), "Final Mix" },
                    { 29, new DateTime(2023, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 11, 0), "Classic Touch" },
                    { 30, new DateTime(2023, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 32, 0), "Night Sparks" },
                    { 31, new DateTime(2023, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 31, 0), "Starlit Path" },
                    { 32, new DateTime(2023, 8, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 14, 0), "Emerald City" },
                    { 33, new DateTime(2023, 9, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 2, 59, 0), "Violet Skies" },
                    { 34, new DateTime(2023, 10, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 51, 0), "Amber Glow" },
                    { 35, new DateTime(2023, 11, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 4, 0), "Shadow Dance" },
                    { 36, new DateTime(2023, 12, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 41, 0), "Sunrise Drive" },
                    { 37, new DateTime(2024, 1, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 9, 0), "Frozen Lake" },
                    { 38, new DateTime(2024, 2, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 28, 0), "Autumn Leaves" },
                    { 39, new DateTime(2024, 3, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 54, 0), "Spring Rain" },
                    { 40, new DateTime(2024, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 7, 0), "Summer Breeze" },
                    { 41, new DateTime(2024, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 35, 0), "Winter Chill" },
                    { 42, new DateTime(2024, 6, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 2, 0), "Rainy Day" },
                    { 43, new DateTime(2024, 7, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 42, 0), "Sunny Side Up" },
                    { 44, new DateTime(2024, 8, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 8, 0), "Cloud Nine" },
                    { 45, new DateTime(2024, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 26, 0), "Misty Morning" },
                    { 46, new DateTime(2024, 10, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 52, 0), "Twilight Zone" },
                    { 47, new DateTime(2024, 11, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 5, 0), "Dawn Patrol" },
                    { 48, new DateTime(2024, 12, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 37, 0), "Evening Star" },
                    { 49, new DateTime(2025, 1, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 10, 0), "Night Owl" },
                    { 50, new DateTime(2025, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 43, 0), "Daydream" },
                    { 51, new DateTime(2025, 3, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 6, 0), "Moonlight Drive" },
                    { 52, new DateTime(2025, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 39, 0), "Sunbeam" },
                    { 53, new DateTime(2025, 5, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 3, 0), "Starfall" },
                    { 54, new DateTime(2025, 6, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 48, 0), "Comet Trail" },
                    { 55, new DateTime(2025, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 11, 0), "Meteor Shower" },
                    { 56, new DateTime(2025, 8, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 32, 0), "Aurora" },
                    { 57, new DateTime(2025, 9, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 13, 0), "Celestial" },
                    { 58, new DateTime(2025, 10, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 34, 0), "Gravity" },
                    { 59, new DateTime(2025, 11, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 9, 0), "Orbit" },
                    { 60, new DateTime(2025, 12, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 36, 0), "Rocket Man" },
                    { 61, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 7, 0), "Satellite" },
                    { 62, new DateTime(2026, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 41, 0), "Cosmic Love" },
                    { 63, new DateTime(2026, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 8, 0), "Galactic" },
                    { 64, new DateTime(2026, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 27, 0), "Nebula" },
                    { 65, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 53, 0), "Supernova" },
                    { 66, new DateTime(2026, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 6, 0), "Black Hole" },
                    { 67, new DateTime(2026, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 38, 0), "Stardust" },
                    { 68, new DateTime(2026, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 3, 0), "Milky Way" },
                    { 69, new DateTime(2026, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 49, 0), "Andromeda" },
                    { 70, new DateTime(2026, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 11, 0), "Orion" },
                    { 71, new DateTime(2026, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 32, 0), "Pegasus" },
                    { 72, new DateTime(2026, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 14, 0), "Phoenix" },
                    { 73, new DateTime(2027, 1, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 2, 59, 0), "Draco" },
                    { 74, new DateTime(2027, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 51, 0), "Lyra" },
                    { 75, new DateTime(2027, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 4, 0), "Cygnus" },
                    { 76, new DateTime(2027, 4, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 41, 0), "Cassiopeia" },
                    { 77, new DateTime(2027, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 9, 0), "Perseus" },
                    { 78, new DateTime(2027, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 28, 0), "Hercules" },
                    { 79, new DateTime(2027, 7, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 54, 0), "Aquila" },
                    { 80, new DateTime(2027, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 7, 0), "Vega" },
                    { 81, new DateTime(2027, 9, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 35, 0), "Altair" },
                    { 82, new DateTime(2027, 10, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 2, 0), "Deneb" },
                    { 83, new DateTime(2027, 11, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 42, 0), "Sirius" },
                    { 84, new DateTime(2027, 12, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 8, 0), "Betelgeuse" },
                    { 85, new DateTime(2028, 1, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 26, 0), "Rigel" },
                    { 86, new DateTime(2028, 2, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 52, 0), "Procyon" },
                    { 87, new DateTime(2028, 3, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 5, 0), "Capella" },
                    { 88, new DateTime(2028, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 37, 0), "Pollux" },
                    { 89, new DateTime(2028, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 10, 0), "Castor" },
                    { 90, new DateTime(2028, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 43, 0), "Spica" },
                    { 91, new DateTime(2028, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 6, 0), "Antares" },
                    { 92, new DateTime(2028, 8, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 39, 0), "Aldebaran" },
                    { 93, new DateTime(2028, 9, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 3, 0), "Fomalhaut" },
                    { 94, new DateTime(2028, 10, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 48, 0), "Mimosa" },
                    { 95, new DateTime(2028, 11, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 11, 0), "Alnilam" },
                    { 96, new DateTime(2028, 12, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 32, 0), "Alnitak" },
                    { 97, new DateTime(2029, 1, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 13, 0), "Saiph" },
                    { 98, new DateTime(2029, 2, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 3, 34, 0), "Bellatrix" },
                    { 99, new DateTime(2029, 3, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 9, 0), "Mintaka" },
                    { 100, new DateTime(2029, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 4, 20, 0), "Finale" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Country", "Email", "FirstName", "IsActive", "LastName", "PasswordHash", "Role", "Token" },
                values: new object[,]
                {
                    { 1, "USA", "john@example.com", "John", true, "Doe", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "admin", "" },
                    { 2, "UK", "jane@example.com", "Jane", true, "Smith", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "admin", "" },
                    { 3, "Mexico", "carlos@musify.com", "Carlos", true, "Mendez", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 4, "Canada", "eva@musify.com", "Eva", true, "Lee", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 5, "Pakistan", "ali@musify.com", "Ali", true, "Khan", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 6, "France", "marie@musify.com", "Marie", true, "Dubois", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 7, "Ireland", "liam@musify.com", "Liam", true, "O'Brien", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 8, "Japan", "yuki@musify.com", "Yuki", true, "Tanaka", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 9, "Egypt", "ahmed@musify.com", "Ahmed", true, "Hassan", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 10, "Russia", "nina@musify.com", "Nina", true, "Popov", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 11, "China", "chen.wei@musify.com", "Chen", true, "Wei", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 12, "UAE", "fatima.alfarsi@musify.com", "Fatima", true, "Al-Farsi", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 13, "Brazil", "lucas.silva@musify.com", "Lucas", true, "Silva", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 14, "India", "priya.sharma@musify.com", "Priya", true, "Sharma", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 15, "Poland", "anna.kowalska@musify.com", "Anna", true, "Kowalska", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 16, "Sweden", "sven.larsen@musify.com", "Sven", true, "Larsen", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 17, "Spain", "marta.garcia@musify.com", "Marta", true, "Garcia", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 18, "Morocco", "omar.said@musify.com", "Omar", true, "Said", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 19, "Italy", "sophia.rossi@musify.com", "Sophia", true, "Rossi", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 20, "Israel", "david.goldberg@musify.com", "David", true, "Goldberg", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 21, "Vietnam", "ava.nguyen@musify.com", "Ava", true, "Nguyen", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 22, "Argentina", "mateo.gonzalez@musify.com", "Mateo", true, "Gonzalez", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 23, "Czech Republic", "julia.novak@musify.com", "Julia", true, "Novak", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 24, "Slovakia", "peter.novak@musify.com", "Peter", true, "Novak", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 25, "Germany", "linda.mueller@musify.com", "Linda", true, "Müller", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 26, "Greece", "george.papadopoulos@musify.com", "George", true, "Papadopoulos", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 27, "Colombia", "isabella.martinez@musify.com", "Isabella", true, "Martinez", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 28, "Jordan", "mohammed.almasri@musify.com", "Mohammed", true, "Al-Masri", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 29, "USA", "emily.johnson@musify.com", "Emily", true, "Johnson", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 30, "South Korea", "noah.kim@musify.com", "Noah", true, "Kim", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 31, "Egypt", "sara.ahmed@musify.com", "Sara", true, "Ahmed", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 32, "France", "lucas.moreau@musify.com", "Lucas", true, "Moreau", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 33, "Bulgaria", "mia.petrova@musify.com", "Mia", true, "Petrova", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 34, "Romania", "andrei.popescu@musify.com", "Andrei", true, "Popescu", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 35, "Portugal", "sofia.costa@musify.com", "Sofia", true, "Costa", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 36, "Russia", "ivan.ivanov@musify.com", "Ivan", true, "Ivanov", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 37, "France", "lea.dubois@musify.com", "Lea", true, "Dubois", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 38, "Spain", "diego.fernandez@musify.com", "Diego", true, "Fernandez", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 39, "Japan", "hana.yamamoto@musify.com", "Hana", true, "Yamamoto", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" },
                    { 40, "USA", "william.brown@musify.com", "William", true, "Brown", "$2a$11$zEX5P8Qp3A2LzXKITmis/uY3xjP4FO0kTJ9liz.3tsynP799iAAmK", "user", "" }
                });

            migrationBuilder.InsertData(
                table: "Albums",
                columns: new[] { "Id", "ArtistId", "Description", "Genre", "Label", "ReleaseDate", "Title" },
                values: new object[,]
                {
                    { 1, 1, "A collection of night-inspired tracks", "Pop", "Universal", new DateTime(2021, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Midnight Collection" },
                    { 2, 2, "Timeless golden hits", "Rock", "RockNation", new DateTime(2021, 6, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Golden Classics" },
                    { 3, 3, "Synth and neon", "Electronic", "ElectroBeat", new DateTime(2021, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Neon Lights" },
                    { 4, 4, "Chill and ambient", "Ambient", "ChillZone", new DateTime(2022, 1, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Crystal Waters" },
                    { 5, 5, "Energetic tracks", "Dance", "DanceFloor", new DateTime(2022, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Electric Avenue" },
                    { 6, 6, "Desert-inspired music", "World", "WorldSound", new DateTime(2022, 7, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Desert Mirage" },
                    { 7, 7, "Relaxing blue tunes", "Jazz", "JazzHouse", new DateTime(2022, 10, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Blue Lagoon" },
                    { 8, 8, "City beats", "Hip-Hop", "CitySounds", new DateTime(2023, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Urban Pulse" },
                    { 9, 9, "Hopeful melodies", "Indie", "IndieWave", new DateTime(2023, 4, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Silver Lining" },
                    { 10, 10, "Songs for the night", "Pop", "PopStar", new DateTime(2023, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Firefly Nights" },
                    { 11, 11, "Driving tunes", "Rock", "RoadTrip", new DateTime(2023, 10, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Sunset Drive" },
                    { 12, 12, "Inspired by the aurora", "Electronic", "ElectroBeat", new DateTime(2024, 1, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Northern Lights" },
                    { 13, 13, "Echoes and memories", "Indie", "IndieWave", new DateTime(2024, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Echoes of You" },
                    { 14, 14, "Smooth and rich", "Jazz", "JazzHouse", new DateTime(2024, 8, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Red Velvet Road" },
                    { 15, 15, "Dance and move", "Dance", "DanceFloor", new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Dancing Shadows" },
                    { 16, 16, "Dreamy soundscapes", "Ambient", "ChillZone", new DateTime(2025, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Dreamscape" },
                    { 17, 17, "Waves of sound", "Pop", "Universal", new DateTime(2025, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Silver Wave" },
                    { 18, 18, "Groovy city beats", "Hip-Hop", "CitySounds", new DateTime(2025, 8, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Urban Groove" },
                    { 19, 19, "Echoes and crystals", "Electronic", "ElectroBeat", new DateTime(2025, 12, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Crystal Echo" },
                    { 20, 20, "Golden age of music", "Classical", "ClassicArts", new DateTime(2026, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Golden Era" }
                });

            migrationBuilder.InsertData(
                table: "ArtistsArtists",
                columns: new[] { "BandsId", "MembersId" },
                values: new object[,]
                {
                    { 36, 1 },
                    { 36, 2 },
                    { 37, 3 },
                    { 37, 4 },
                    { 38, 5 },
                    { 38, 6 },
                    { 39, 7 },
                    { 39, 8 },
                    { 40, 9 },
                    { 40, 10 },
                    { 41, 11 },
                    { 41, 12 },
                    { 42, 13 },
                    { 42, 14 },
                    { 43, 15 },
                    { 43, 16 },
                    { 44, 17 },
                    { 44, 18 },
                    { 45, 19 },
                    { 45, 20 },
                    { 46, 21 },
                    { 46, 22 },
                    { 47, 23 },
                    { 47, 24 },
                    { 48, 25 },
                    { 48, 26 },
                    { 49, 27 },
                    { 49, 28 },
                    { 50, 29 },
                    { 50, 30 }
                });

            migrationBuilder.InsertData(
                table: "Playlists",
                columns: new[] { "Id", "CreatedAt", "Name", "Type", "UpdatedAt", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Morning Motivation", "public", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 2, new DateTime(2024, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), "Evening Chill", "private", new DateTime(2024, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 2 },
                    { 3, new DateTime(2024, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Workout Hits", "public", new DateTime(2024, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 3 },
                    { 4, new DateTime(2024, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Focus Flow", "private", new DateTime(2024, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 4 },
                    { 5, new DateTime(2024, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Party Starters", "public", new DateTime(2024, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 5 },
                    { 6, new DateTime(2024, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Late Night", "private", new DateTime(2024, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 6 },
                    { 7, new DateTime(2024, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), "Travel Tunes", "public", new DateTime(2024, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 7 },
                    { 8, new DateTime(2024, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), "Study Session", "private", new DateTime(2024, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 8 },
                    { 9, new DateTime(2024, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Feel Good", "public", new DateTime(2024, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 9 },
                    { 10, new DateTime(2024, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Relaxation", "private", new DateTime(2024, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 10 },
                    { 11, new DateTime(2024, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "Road Trip", "public", new DateTime(2024, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 11 },
                    { 12, new DateTime(2024, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), "Deep Focus", "private", new DateTime(2024, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 12 },
                    { 13, new DateTime(2025, 1, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "Summer Vibes", "public", new DateTime(2025, 1, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 13 },
                    { 14, new DateTime(2025, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), "Winter Warmth", "private", new DateTime(2025, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 14 },
                    { 15, new DateTime(2025, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Spring Energy", "public", new DateTime(2025, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 15 },
                    { 16, new DateTime(2025, 4, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), "Autumn Leaves", "private", new DateTime(2025, 4, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 16 },
                    { 17, new DateTime(2025, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Chill Beats", "public", new DateTime(2025, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 17 },
                    { 18, new DateTime(2025, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), "Energy Boost", "private", new DateTime(2025, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 18 },
                    { 19, new DateTime(2025, 7, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Throwback", "public", new DateTime(2025, 7, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 19 },
                    { 20, new DateTime(2025, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Zen Mode", "private", new DateTime(2025, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 20 }
                });

            migrationBuilder.InsertData(
                table: "SongAlternativeTitles",
                columns: new[] { "Id", "AlternativeTitle", "Language", "SongId" },
                values: new object[,]
                {
                    { 1, "Cântec A", "Romanian", 1 },
                    { 2, "Feu de Minuit", "French", 2 },
                    { 3, "Surgir de Nuevo", "Spanish", 3 },
                    { 4, "Ciel Néon", "French", 4 },
                    { 5, "Luzes de Cristal", "Portuguese", 5 },
                    { 6, "Sol do Deserto", "Portuguese", 6 },
                    { 7, "Horizon Bleu", "French", 7 },
                    { 8, "Noches Urbanas", "Spanish", 8 },
                    { 9, "Cordes Dorées", "French", 9 },
                    { 10, "Sueño Eléctrico", "Spanish", 10 },
                    { 11, "Conduite au Soleil", "French", 11 },
                    { 12, "Luci del Nord", "Italian", 12 },
                    { 13, "Ecos", "Spanish", 13 },
                    { 14, "Velours Rouge", "French", 14 },
                    { 15, "Luciola", "Italian", 15 },
                    { 16, "Paisaje de Sueños", "Spanish", 16 },
                    { 17, "Vague d'Argent", "French", 17 },
                    { 18, "Groove Urbano", "Portuguese", 18 },
                    { 19, "Écho de Cristal", "French", 19 },
                    { 20, "Era Dorada", "Spanish", 20 },
                    { 21, "Luna Azul", "Spanish", 21 },
                    { 22, "Rosa del Desierto", "Spanish", 22 },
                    { 23, "Mode Concentré", "French", 23 },
                    { 24, "Éxitos Retro", "Spanish", 24 },
                    { 25, "Impulso de Entrenamiento", "Spanish", 25 },
                    { 26, "Éxitos de Fiesta", "Spanish", 26 },
                    { 27, "Vibraciones Relajantes", "Spanish", 27 },
                    { 28, "Mezcla Final", "Spanish", 28 },
                    { 29, "Toque Clásico", "Spanish", 29 },
                    { 30, "Chispas Nocturnas", "Spanish", 30 },
                    { 31, "Song A", "English", 31 },
                    { 32, "Midnight Fire", "English", 32 },
                    { 33, "Rise Again", "English", 33 },
                    { 34, "Neon Skies", "English", 34 },
                    { 35, "Crystal Lights", "English", 35 },
                    { 36, "Desert Sun", "English", 36 },
                    { 37, "Blue Horizon", "English", 37 },
                    { 38, "Urban Nights", "English", 38 },
                    { 39, "Golden Strings", "English", 39 },
                    { 40, "Electric Dream", "English", 40 },
                    { 41, "Sunset Drive", "English", 41 },
                    { 42, "Northern Lights", "English", 42 },
                    { 43, "Echoes", "English", 43 },
                    { 44, "Red Velvet", "English", 44 },
                    { 45, "Firefly", "English", 45 },
                    { 46, "Dreamscape", "English", 46 },
                    { 47, "Silver Wave", "English", 47 },
                    { 48, "Urban Groove", "English", 48 },
                    { 49, "Crystal Echo", "English", 49 },
                    { 50, "Golden Era", "English", 50 },
                    { 51, "Song A", "English", 51 },
                    { 52, "Midnight Fire", "English", 52 },
                    { 53, "Rise Again", "English", 53 },
                    { 54, "Neon Skies", "English", 54 },
                    { 55, "Crystal Lights", "English", 55 },
                    { 56, "Desert Sun", "English", 56 },
                    { 57, "Blue Horizon", "English", 57 },
                    { 58, "Urban Nights", "English", 58 },
                    { 59, "Golden Strings", "English", 59 },
                    { 60, "Electric Dream", "English", 60 },
                    { 61, "Sunset Drive", "English", 61 },
                    { 62, "Northern Lights", "English", 62 },
                    { 63, "Echoes", "English", 63 },
                    { 64, "Red Velvet", "English", 64 },
                    { 65, "Firefly", "English", 65 },
                    { 66, "Dreamscape", "English", 66 },
                    { 67, "Silver Wave", "English", 67 },
                    { 68, "Urban Groove", "English", 68 },
                    { 69, "Crystal Echo", "English", 69 },
                    { 70, "Golden Era", "English", 70 },
                    { 71, "Blue Moon", "English", 71 },
                    { 72, "Desert Rose", "English", 72 },
                    { 73, "Focus Mode", "English", 73 },
                    { 74, "Throwback Jams", "English", 74 },
                    { 75, "Workout Boost", "English", 75 },
                    { 76, "Party Hits", "English", 76 },
                    { 77, "Chill Vibes", "English", 77 },
                    { 78, "Final Mix", "English", 78 },
                    { 79, "Classic Touch", "English", 79 },
                    { 80, "Night Sparks", "English", 80 },
                    { 81, "Song A", "English", 81 },
                    { 82, "Midnight Fire", "English", 82 },
                    { 83, "Rise Again", "English", 83 },
                    { 84, "Neon Skies", "English", 84 },
                    { 85, "Crystal Lights", "English", 85 },
                    { 86, "Desert Sun", "English", 86 },
                    { 87, "Blue Horizon", "English", 87 },
                    { 88, "Urban Nights", "English", 88 },
                    { 89, "Golden Strings", "English", 89 },
                    { 90, "Electric Dream", "English", 90 },
                    { 91, "Sunset Drive", "English", 91 },
                    { 92, "Northern Lights", "English", 92 },
                    { 93, "Echoes", "English", 93 },
                    { 94, "Red Velvet", "English", 94 },
                    { 95, "Firefly", "English", 95 },
                    { 96, "Dreamscape", "English", 96 },
                    { 97, "Silver Wave", "English", 97 },
                    { 98, "Urban Groove", "English", 98 },
                    { 99, "Crystal Echo", "English", 99 },
                    { 100, "Golden Era", "English", 100 }
                });

            migrationBuilder.InsertData(
                table: "SongArtists",
                columns: new[] { "Id", "ArtistId", "SongId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 2, 2 },
                    { 3, 3, 3 },
                    { 4, 4, 4 },
                    { 5, 5, 5 },
                    { 6, 6, 6 },
                    { 7, 7, 7 },
                    { 8, 8, 8 },
                    { 9, 9, 9 },
                    { 10, 10, 10 },
                    { 11, 11, 11 },
                    { 12, 12, 11 },
                    { 13, 13, 12 },
                    { 14, 14, 12 },
                    { 15, 15, 13 },
                    { 16, 16, 13 },
                    { 17, 17, 14 },
                    { 18, 18, 14 },
                    { 19, 19, 15 },
                    { 20, 20, 15 },
                    { 21, 21, 16 },
                    { 22, 22, 16 },
                    { 23, 23, 17 },
                    { 24, 24, 17 },
                    { 25, 25, 18 },
                    { 26, 26, 18 },
                    { 27, 27, 19 },
                    { 28, 28, 19 },
                    { 29, 29, 20 },
                    { 30, 30, 20 },
                    { 31, 31, 21 },
                    { 32, 32, 21 },
                    { 33, 33, 21 },
                    { 34, 34, 22 },
                    { 35, 35, 22 },
                    { 36, 36, 22 },
                    { 37, 37, 23 },
                    { 38, 38, 23 },
                    { 39, 39, 23 },
                    { 40, 40, 24 },
                    { 41, 41, 24 },
                    { 42, 42, 24 },
                    { 43, 43, 25 },
                    { 44, 44, 25 },
                    { 45, 45, 25 },
                    { 46, 46, 26 },
                    { 47, 47, 26 },
                    { 48, 48, 26 },
                    { 49, 49, 27 },
                    { 50, 50, 27 },
                    { 51, 1, 27 },
                    { 52, 2, 28 },
                    { 53, 3, 28 },
                    { 54, 4, 28 },
                    { 55, 5, 29 },
                    { 56, 6, 29 },
                    { 57, 7, 29 },
                    { 58, 8, 30 },
                    { 59, 9, 30 },
                    { 60, 10, 30 },
                    { 61, 11, 31 },
                    { 62, 12, 32 },
                    { 63, 13, 32 },
                    { 64, 14, 33 },
                    { 65, 15, 33 },
                    { 66, 16, 33 },
                    { 67, 17, 34 },
                    { 68, 18, 34 },
                    { 69, 19, 34 },
                    { 70, 20, 35 },
                    { 71, 21, 35 },
                    { 72, 22, 35 },
                    { 73, 23, 36 },
                    { 74, 24, 36 },
                    { 75, 25, 36 },
                    { 76, 26, 37 },
                    { 77, 27, 37 },
                    { 78, 28, 37 },
                    { 79, 29, 38 },
                    { 80, 30, 38 },
                    { 81, 31, 38 },
                    { 82, 32, 39 },
                    { 83, 33, 39 },
                    { 84, 34, 39 },
                    { 85, 35, 40 },
                    { 86, 36, 40 },
                    { 87, 37, 40 },
                    { 88, 38, 41 },
                    { 89, 39, 41 },
                    { 90, 40, 41 },
                    { 91, 41, 42 },
                    { 92, 42, 42 },
                    { 93, 43, 42 },
                    { 94, 44, 43 },
                    { 95, 45, 43 },
                    { 96, 46, 43 },
                    { 97, 47, 44 },
                    { 98, 48, 44 },
                    { 99, 49, 44 },
                    { 100, 50, 45 },
                    { 101, 1, 46 },
                    { 102, 2, 47 },
                    { 103, 3, 47 },
                    { 104, 4, 48 },
                    { 105, 5, 48 },
                    { 106, 6, 48 },
                    { 107, 7, 49 },
                    { 108, 8, 49 },
                    { 109, 9, 49 },
                    { 110, 10, 49 },
                    { 111, 11, 50 },
                    { 112, 12, 50 },
                    { 113, 13, 50 },
                    { 114, 14, 50 },
                    { 115, 15, 51 },
                    { 116, 16, 52 },
                    { 117, 17, 52 },
                    { 118, 18, 53 },
                    { 119, 19, 53 },
                    { 120, 20, 53 },
                    { 121, 21, 54 },
                    { 122, 22, 54 },
                    { 123, 23, 54 },
                    { 124, 24, 55 },
                    { 125, 25, 55 },
                    { 126, 26, 55 },
                    { 127, 27, 56 },
                    { 128, 28, 56 },
                    { 129, 29, 56 },
                    { 130, 30, 57 },
                    { 131, 31, 57 },
                    { 132, 32, 57 },
                    { 133, 33, 58 },
                    { 134, 34, 58 },
                    { 135, 35, 58 },
                    { 136, 36, 59 },
                    { 137, 37, 59 },
                    { 138, 38, 59 },
                    { 139, 39, 60 },
                    { 140, 40, 60 },
                    { 141, 41, 60 },
                    { 142, 42, 61 },
                    { 143, 43, 62 },
                    { 144, 44, 62 },
                    { 145, 45, 63 },
                    { 146, 46, 63 },
                    { 147, 47, 63 },
                    { 148, 48, 64 },
                    { 149, 49, 64 },
                    { 150, 50, 64 },
                    { 151, 1, 65 },
                    { 152, 2, 65 },
                    { 153, 3, 65 },
                    { 154, 4, 66 },
                    { 155, 5, 66 },
                    { 156, 6, 66 },
                    { 157, 7, 67 },
                    { 158, 8, 67 },
                    { 159, 9, 67 },
                    { 160, 10, 68 },
                    { 161, 11, 68 },
                    { 162, 12, 68 },
                    { 163, 13, 69 },
                    { 164, 14, 69 },
                    { 165, 15, 69 },
                    { 166, 16, 70 },
                    { 167, 17, 70 },
                    { 168, 18, 70 },
                    { 169, 19, 71 },
                    { 170, 20, 71 },
                    { 171, 21, 71 },
                    { 172, 22, 72 },
                    { 173, 23, 72 },
                    { 174, 24, 72 },
                    { 175, 25, 73 },
                    { 176, 26, 73 },
                    { 177, 27, 73 },
                    { 178, 28, 74 },
                    { 179, 29, 74 },
                    { 180, 30, 74 },
                    { 181, 31, 75 },
                    { 182, 32, 75 },
                    { 183, 33, 75 },
                    { 184, 34, 76 },
                    { 185, 35, 76 },
                    { 186, 36, 76 },
                    { 187, 37, 77 },
                    { 188, 38, 77 },
                    { 189, 39, 77 },
                    { 190, 40, 78 },
                    { 191, 41, 78 },
                    { 192, 42, 78 },
                    { 193, 43, 79 },
                    { 194, 44, 79 },
                    { 195, 45, 79 },
                    { 196, 46, 80 },
                    { 197, 47, 80 },
                    { 198, 48, 80 },
                    { 199, 49, 81 },
                    { 200, 50, 81 },
                    { 201, 1, 81 },
                    { 202, 2, 82 },
                    { 203, 3, 82 },
                    { 204, 4, 82 },
                    { 205, 5, 83 },
                    { 206, 6, 83 },
                    { 207, 7, 83 },
                    { 208, 8, 84 },
                    { 209, 9, 84 },
                    { 210, 10, 84 },
                    { 211, 11, 85 },
                    { 212, 12, 85 },
                    { 213, 13, 85 },
                    { 214, 14, 86 },
                    { 215, 15, 86 },
                    { 216, 16, 86 },
                    { 217, 17, 87 },
                    { 218, 18, 87 },
                    { 219, 19, 87 },
                    { 220, 20, 88 },
                    { 221, 21, 88 },
                    { 222, 22, 88 },
                    { 223, 23, 89 },
                    { 224, 24, 89 },
                    { 225, 25, 89 },
                    { 226, 26, 90 },
                    { 227, 27, 90 },
                    { 228, 28, 90 },
                    { 229, 29, 91 },
                    { 230, 30, 91 },
                    { 231, 31, 91 },
                    { 232, 32, 92 },
                    { 233, 33, 92 },
                    { 234, 34, 92 },
                    { 235, 35, 93 },
                    { 236, 36, 93 },
                    { 237, 37, 93 },
                    { 238, 38, 94 },
                    { 239, 39, 94 },
                    { 240, 40, 94 },
                    { 241, 41, 95 },
                    { 242, 42, 95 },
                    { 243, 43, 95 },
                    { 244, 44, 96 },
                    { 245, 45, 96 },
                    { 246, 46, 96 },
                    { 247, 47, 97 },
                    { 248, 48, 97 },
                    { 249, 49, 97 },
                    { 250, 50, 98 },
                    { 251, 1, 98 },
                    { 252, 2, 98 },
                    { 253, 3, 99 },
                    { 254, 4, 99 },
                    { 255, 5, 99 },
                    { 256, 6, 100 }
                });

            migrationBuilder.InsertData(
                table: "AlbumSongs",
                columns: new[] { "Id", "AlbumId", "Position", "SongId" },
                values: new object[,]
                {
                    { 1, 1, 1, 1 },
                    { 2, 1, 2, 2 },
                    { 3, 1, 3, 3 },
                    { 4, 2, 1, 4 },
                    { 5, 2, 2, 5 },
                    { 6, 2, 3, 6 },
                    { 7, 3, 1, 7 },
                    { 8, 3, 2, 8 },
                    { 9, 3, 3, 9 },
                    { 10, 4, 1, 10 },
                    { 11, 4, 2, 11 },
                    { 12, 4, 3, 12 },
                    { 13, 5, 1, 13 },
                    { 14, 5, 2, 14 },
                    { 15, 5, 3, 15 },
                    { 16, 6, 1, 16 },
                    { 17, 6, 2, 17 },
                    { 18, 6, 3, 18 },
                    { 19, 7, 1, 19 },
                    { 20, 7, 2, 20 },
                    { 21, 7, 3, 21 },
                    { 22, 8, 1, 22 },
                    { 23, 8, 2, 23 },
                    { 24, 8, 3, 24 },
                    { 25, 9, 1, 25 },
                    { 26, 9, 2, 26 },
                    { 27, 9, 3, 27 },
                    { 28, 10, 1, 28 },
                    { 29, 10, 2, 29 },
                    { 30, 10, 3, 30 },
                    { 31, 11, 1, 31 },
                    { 32, 11, 2, 32 },
                    { 33, 11, 3, 33 },
                    { 34, 12, 1, 34 },
                    { 35, 12, 2, 35 },
                    { 36, 12, 3, 36 },
                    { 37, 13, 1, 37 },
                    { 38, 13, 2, 38 },
                    { 39, 13, 3, 39 },
                    { 40, 14, 1, 40 },
                    { 41, 14, 2, 41 },
                    { 42, 14, 3, 42 },
                    { 43, 15, 1, 43 },
                    { 44, 15, 2, 44 },
                    { 45, 15, 3, 45 },
                    { 46, 16, 1, 46 },
                    { 47, 16, 2, 47 },
                    { 48, 16, 3, 48 },
                    { 49, 17, 1, 49 },
                    { 50, 17, 2, 50 },
                    { 51, 17, 3, 51 },
                    { 52, 18, 1, 52 },
                    { 53, 18, 2, 53 },
                    { 54, 18, 3, 54 },
                    { 55, 19, 1, 55 },
                    { 56, 19, 2, 56 },
                    { 57, 19, 3, 57 },
                    { 58, 20, 1, 58 },
                    { 59, 20, 2, 59 },
                    { 60, 20, 3, 60 }
                });

            migrationBuilder.InsertData(
                table: "PlaylistFollowers",
                columns: new[] { "Id", "PlaylistId", "UserId" },
                values: new object[,]
                {
                    { 1, 1, 2 },
                    { 2, 1, 3 },
                    { 3, 1, 4 },
                    { 4, 1, 5 },
                    { 5, 3, 6 },
                    { 6, 3, 7 },
                    { 7, 3, 8 },
                    { 8, 3, 9 },
                    { 9, 5, 10 },
                    { 10, 5, 11 },
                    { 11, 5, 12 },
                    { 12, 5, 13 },
                    { 13, 7, 14 },
                    { 14, 7, 15 },
                    { 15, 7, 16 },
                    { 16, 7, 17 },
                    { 17, 9, 18 },
                    { 18, 9, 19 },
                    { 19, 9, 20 },
                    { 20, 9, 21 },
                    { 21, 11, 22 },
                    { 22, 11, 23 },
                    { 23, 11, 24 },
                    { 24, 11, 25 },
                    { 25, 13, 26 },
                    { 26, 13, 27 },
                    { 27, 13, 28 },
                    { 28, 13, 29 },
                    { 29, 15, 30 },
                    { 30, 15, 31 },
                    { 31, 15, 32 },
                    { 32, 15, 33 },
                    { 33, 17, 34 },
                    { 34, 17, 35 },
                    { 35, 17, 36 },
                    { 36, 17, 37 },
                    { 37, 19, 38 },
                    { 38, 19, 39 },
                    { 39, 19, 40 },
                    { 40, 19, 1 }
                });

            migrationBuilder.InsertData(
                table: "PlaylistSongs",
                columns: new[] { "Id", "PlaylistId", "Position", "SongId" },
                values: new object[,]
                {
                    { 1, 1, 1, 1 },
                    { 2, 1, 2, 2 },
                    { 3, 1, 3, 3 },
                    { 4, 2, 1, 4 },
                    { 5, 2, 2, 5 },
                    { 6, 2, 3, 6 },
                    { 7, 3, 1, 7 },
                    { 8, 3, 2, 8 },
                    { 9, 3, 3, 9 },
                    { 10, 4, 1, 10 },
                    { 11, 4, 2, 11 },
                    { 12, 4, 3, 12 },
                    { 13, 5, 1, 13 },
                    { 14, 5, 2, 14 },
                    { 15, 5, 3, 15 },
                    { 16, 6, 1, 16 },
                    { 17, 6, 2, 17 },
                    { 18, 6, 3, 18 },
                    { 19, 7, 1, 19 },
                    { 20, 7, 2, 20 },
                    { 21, 7, 3, 21 },
                    { 22, 8, 1, 22 },
                    { 23, 8, 2, 23 },
                    { 24, 8, 3, 24 },
                    { 25, 9, 1, 25 },
                    { 26, 9, 2, 26 },
                    { 27, 9, 3, 27 },
                    { 28, 10, 1, 28 },
                    { 29, 10, 2, 29 },
                    { 30, 10, 3, 30 },
                    { 31, 11, 1, 31 },
                    { 32, 11, 2, 32 },
                    { 33, 11, 3, 33 },
                    { 34, 12, 1, 34 },
                    { 35, 12, 2, 35 },
                    { 36, 12, 3, 36 },
                    { 37, 13, 1, 37 },
                    { 38, 13, 2, 38 },
                    { 39, 13, 3, 39 },
                    { 40, 14, 1, 40 },
                    { 41, 14, 2, 41 },
                    { 42, 14, 3, 42 },
                    { 43, 15, 1, 43 },
                    { 44, 15, 2, 44 },
                    { 45, 15, 3, 45 },
                    { 46, 16, 1, 46 },
                    { 47, 16, 2, 47 },
                    { 48, 16, 3, 48 },
                    { 49, 17, 1, 49 },
                    { 50, 17, 2, 50 },
                    { 51, 17, 3, 51 },
                    { 52, 18, 1, 52 },
                    { 53, 18, 2, 53 },
                    { 54, 18, 3, 54 },
                    { 55, 19, 1, 55 },
                    { 56, 19, 2, 56 },
                    { 57, 19, 3, 57 },
                    { 58, 20, 1, 58 },
                    { 59, 20, 2, 59 },
                    { 60, 20, 3, 60 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Albums_ArtistId",
                table: "Albums",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumSongs_AlbumId",
                table: "AlbumSongs",
                column: "AlbumId");

            migrationBuilder.CreateIndex(
                name: "IX_AlbumSongs_SongId",
                table: "AlbumSongs",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_ArtistsArtists_MembersId",
                table: "ArtistsArtists",
                column: "MembersId");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistFollowers_PlaylistId",
                table: "PlaylistFollowers",
                column: "PlaylistId");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistFollowers_UserId",
                table: "PlaylistFollowers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_UserId",
                table: "Playlists",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistSongs_PlaylistId",
                table: "PlaylistSongs",
                column: "PlaylistId");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistSongs_SongId",
                table: "PlaylistSongs",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_SongAlternativeTitles_SongId",
                table: "SongAlternativeTitles",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_SongArtists_ArtistId",
                table: "SongArtists",
                column: "ArtistId");

            migrationBuilder.CreateIndex(
                name: "IX_SongArtists_SongId",
                table: "SongArtists",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlbumSongs");

            migrationBuilder.DropTable(
                name: "ArtistsArtists");

            migrationBuilder.DropTable(
                name: "PlaylistFollowers");

            migrationBuilder.DropTable(
                name: "PlaylistSongs");

            migrationBuilder.DropTable(
                name: "SongAlternativeTitles");

            migrationBuilder.DropTable(
                name: "SongArtists");

            migrationBuilder.DropTable(
                name: "Albums");

            migrationBuilder.DropTable(
                name: "Playlists");

            migrationBuilder.DropTable(
                name: "Songs");

            migrationBuilder.DropTable(
                name: "Artists");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
