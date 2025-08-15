class PlaylistDetailPage {
    elements = {
        releaseDetailsContainer: '.release-details-container',
        releaseTitle: '.release-title',
        releaseArtist: '.release-artist mat-icon',
        releaseGenre: '.release-genre',
        releaseCount: '.release-count',
        releaseDescription: '.release-description',
        releaseFooter: '.release-footer',

        releaseHeaderActions: '.release-header-actions',
        albumsToggleButton: '.albums-toggle-btn',
        releaseTable: '.release-table',
        releaseTableRow: '.release-table-row',
        deleteButton: 'button[aria-label="Remove Song"]',
        deleteAlbumButton: 'button[aria-label="Remove Album"]',
        addAllButton: 'button[aria-label="Add"]',
        addSongButton: 'button:contains("Add Song")',
        addAlbumButton: 'button:contains("Add Album")',
        songTitle: '.song-title',

        // Elements for add song dialog
        addSongDialogContainer: '.add-song-dialog-container',
        songInput: 'input[placeholder="Type to filter songs..."]',
        songRadioButton: '.add-song-radio',

        addButton: 'button:contains("Add")',

        // Elements for add album dialog
        addAlbumDialogContainer: '.add-album-dialog-container',
        albumInput: 'input[placeholder="Type to filter albums..."]',
        albumRadioButton: '.add-album-radio',
    };
}

export default new PlaylistDetailPage();
