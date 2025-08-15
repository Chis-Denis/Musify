class PlaylistCategoriesPage {
    elements = {
        playlistCategoriesSection: '.playlists-categories',
        playlistCategoriesButtons: '.playlists-categories__buttons',
        allButton: '.playlists-categories button:contains("All")',
        privateButton: '.playlists-categories button:contains("Private")',
        publicButton: '.playlists-categories button:contains("Public")',
        createButton: '.playlists-categories button:contains("Create")',
        searchInput: 'input[placeholder="What playlist do you want to find?"], input[name="searchName"]',
        emptyCategoriesMessage: '.playlists-categories__empty',
        playlistCategoriesPlaylist: '.playlists-categories__playlist',
        carousel: '.playlists-categories .carousel',
        followButton: '.playlists-categories__actions button[matTooltip="Follow/Unfollow"]',
        playlistTitle: 'mat-card-title',

    };

}

export default new PlaylistCategoriesPage();
