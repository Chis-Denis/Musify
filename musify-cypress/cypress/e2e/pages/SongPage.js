export class SongPage {
  elements = {
    trendingSection: () => cy.get('section.trending'),
    trendingSongsCards: () => cy.get('section.trending .carousel mat-card'),
    errorMessage: () => cy.get('section.trending .error'),
    songDetailPage: () => cy.get('.song-detail-page'),
    songTitle: () => cy.get('.song-header-box h1'),
    playButton: () => cy.get('button[mat-fab]'),
    playlistDropdownToggle: () => cy.get('button[mat-icon-button]').filter(':contains("add")'),
    playlistDropdown: () => cy.get('.playlist-dropdown'),
    playlistSelect: () => cy.get('.playlist-dropdown mat-select'),
    playlistOptions: () => cy.get('body .cdk-overlay-container mat-option'),
    addToPlaylistButton: () => cy.get('button').contains('Add to Playlist'),
    artistCards: () => cy.get('.artist-list-section mat-card'),
  }

  visitHome() {
    cy.visit('/home');
  }

  getTrendingSongsCount() {
    return this.elements.trendingSongsCards().its('length');
  }

  clickFirstTrendingSong() {
    this.elements.trendingSongsCards().first().click();
  }

  playSong() {
    this.elements.playButton().click();
  }

  togglePlaylistDropdown() {
    this.elements.playlistDropdownToggle().click();
  }

  selectFirstPlaylist() {
    cy.get('.song-detail-page').should('be.visible');
    cy.get('h1').should('be.visible');
    
    cy.togglePlaylistDropdown();
    
    cy.get('.playlist-dropdown').should('be.visible');
    cy.get('.playlist-dropdown mat-select').should('be.visible');
    
    cy.wait(1000);
    
    cy.get('.playlist-dropdown mat-select')
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'true')
      .click();

    cy.get('.cdk-overlay-container', { timeout: 10000 })
      .should('exist')
      .should('be.visible');

    cy.get('.cdk-overlay-container mat-option', { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();

    cy.get('body').type('{esc}')
    
    cy.get('button').contains('Add to Playlist')
      .should('not.be.disabled')
      .click();
  }

  clickFirstArtist() {
    this.elements.artistCards().first().click();
  }

  clickOptionMenu() {
    cy.get('button mat-icon')
      .contains('more_horiz')
      .click({ force: true });

    cy.get('.cdk-overlay-pane', { timeout: 5000 })
      .should('exist')
      .and('be.visible');
  }
}

export default new SongPage();
