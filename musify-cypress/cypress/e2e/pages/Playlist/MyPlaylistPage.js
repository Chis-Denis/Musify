class MyPlaylistPage {
    elements = {
        followedButton: 'button:contains("Followed")',
        createdByMeButton: 'button:contains("Created by Me")',
        playlistItem: '.playlists-categories__playlist',
        editButton: '.playlists-categories__actions button mat-icon:contains("edit")',
        deleteButton: '.playlists-categories__actions button mat-icon:contains("delete")',
        followButton: '.playlists-categories__actions button mat-icon:contains("favorite")',
        playlistEmptyMessage: '.my-playlists__empty',
    };

}

export default new MyPlaylistPage();
