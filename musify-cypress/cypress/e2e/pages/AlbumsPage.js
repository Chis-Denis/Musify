class AlbumsPage {
  elements = {
    albumsTitle: 'mat-card-title:contains("Albums")',
    mainDiv: '.main-div',
    albumListSearches: '.album-list-searches',
    albumCards: 'mat-card',
    albumTitle: '.album-title',
    albumArtist: '.album-artist',
    albumGenre: '.album-genre',
    albumReleaseDate: '.album-release-date',
    albumImage: '.album-image',
    albumContent: '.album-content',
    albumInfo: '.album-info',
    albumItem: '.album-item',
    selectedAlbum: '.album-card.selected',
    pagination: '.pagination',
    previousButton: 'button:contains("←")',
    nextButton: 'button:contains("→")',
    pageInfo: '.pagination span',
    albumDetail: '.album-detail',
    backButton: 'button mat-icon:contains("arrow_back"), mat-icon:contains("arrow_back")',
    albumHeader: '.album-header',
    albumMeta: '.album-meta',
    albumSubtitle: '.album-subtitle',
    songsTable: '.songs-table',
    clickableRow: '.clickable-row',
    additionalInfo: '.additional-info',
    loadingSpinner: 'mat-spinner',
    loadingText: 'p:contains("Loading album details...")',
    errorIcon: 'mat-icon:contains("error")',
    errorTitle: 'h3:contains("Album Not Found")',
    errorMessage: 'p:contains("The requested album could not be found")',
    backToAlbumsButton: 'button:contains("Back to Albums")'
  }

  visit() {
    cy.visit('/home/albums', { failOnStatusCode: false })
    return this
  }

  getAlbumCards() {
    return cy.get(this.elements.albumCards)
  }

  getAlbumTitle(albumIndex = 0) {
    return cy.get(this.elements.albumTitle).eq(albumIndex)
  }

  getAlbumArtist(albumIndex = 0) {
    return cy.get(this.elements.albumArtist).eq(albumIndex)
  }

  getAlbumGenre(albumIndex = 0) {
    return cy.get(this.elements.albumGenre).eq(albumIndex)
  }

  getAlbumReleaseDate(albumIndex = 0) {
    return cy.get(this.elements.albumReleaseDate).eq(albumIndex)
  }

  selectAlbum(albumIndex = 0) {
    cy.get(this.elements.albumCards).eq(albumIndex).click()
    return this
  }

  getSelectedAlbum() {
    return cy.get(this.elements.selectedAlbum)
  }

  getPreviousPageButton() {
    return cy.get(this.elements.previousButton)
  }

  getNextPageButton() {
    return cy.get(this.elements.nextButton)
  }

  getCurrentPageInfo() {
    return cy.get(this.elements.pageInfo)
  }

  clickNextPage() {
    cy.get(this.elements.nextButton).click()
    return this
  }

  clickPreviousPage() {
    cy.get(this.elements.previousButton).click()
    return this
  }

  clickBackButton() {
    cy.get(this.elements.backButton).click()
    return this
  }

  getSongsTable() {
    return cy.get(this.elements.songsTable)
  }

  clickSongRow(rowIndex = 0) {
    cy.get(this.elements.clickableRow).eq(rowIndex).click()
    return this
  }

  verifyAlbumsPageLoaded() {
    cy.get(this.elements.albumsTitle).should('be.visible')
    cy.get(this.elements.albumListSearches).should('be.visible')
    return this
  }

  verifyAlbumCardsExist() {
    cy.get(this.elements.albumCards).should('have.length.greaterThan', 0)
    return this
  }

  verifyPaginationExists() {
    cy.get(this.elements.pagination).should('be.visible')
    cy.get(this.elements.previousButton).should('be.visible')
    cy.get(this.elements.nextButton).should('be.visible')
    return this
  }

  verifyAlbumInfo(albumIndex = 0) {
    this.getAlbumTitle(albumIndex).should('be.visible')
    this.getAlbumArtist(albumIndex).should('be.visible')
    this.getAlbumGenre(albumIndex).should('be.visible')
    this.getAlbumReleaseDate(albumIndex).should('be.visible')
    return this
  }

  verifyAlbumDetailPage() {
    cy.get(this.elements.albumDetail).should('be.visible')
    cy.get(this.elements.albumHeader).should('be.visible')
    return this
  }

  verifyLoadingState() {
    cy.get(this.elements.loadingSpinner).should('be.visible')
    cy.get(this.elements.loadingText).should('be.visible')
    return this
  }

  verifyErrorState() {
    cy.get(this.elements.errorIcon).should('be.visible')
    cy.get(this.elements.errorTitle).should('be.visible')
    cy.get(this.elements.errorMessage).should('be.visible')
    return this
  }

  isAlbumsPage() {
    cy.get(this.elements.albumsTitle).should('be.visible')
    cy.url().should('include', '/home/albums')
    return this
  }

  hasAlbumCards() {
    cy.get(this.elements.albumCards).should('have.length.greaterThan', 0)
    return this
  }

  isAlbumDetailPage() {
    cy.get(this.elements.albumDetail).should('be.visible')
    return this
  }

  getAlbumCount() {
    return cy.get(this.elements.albumCards).then(($cards) => $cards.length)
  }

  getCurrentPageNumber() {
    return cy.get(this.elements.pageInfo).invoke('text')
  }

  getSongCount() {
    return cy.get(this.elements.clickableRow).then(($rows) => $rows.length)
  }
}

export default new AlbumsPage() 