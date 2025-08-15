class PlaylistPage {
  elements = {
    playlists: '.playlists',
    playlistsPink: '.playlists-pink',
    playlistsHeaderRow: '.playlists-header-row',
    loadingSpinner: '.playlists__loading',
    categories: 'app-playlists-categories',
    myPlaylists: 'app-playlists-my-playlists'
  }

  visit() {
    cy.visit('/home/playlists', { failOnStatusCode: false })
    return this
  }

  getElements() {
    return this.elements
  }

  
}

export default new PlaylistPage();