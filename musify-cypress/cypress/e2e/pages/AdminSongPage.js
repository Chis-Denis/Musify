export class AdminSongsPage {
  elements = {
    adminContainer: '.admin-songs-container',
    formSection: '.form-section',
    addSongTitle: 'h3:contains("Add New Song")',
    titleInput: 'input[placeholder="Enter song title"]',
    artistSelect: 'mat-select[placeholder="Select Artists"]',
    dateInput: 'input[placeholder="Creation Date"]',
    addSongButton: 'button:contains("Add Song")',
    editSongButton: 'button:contains("Save")',
    tableSection: '.table-section',
    searchField: '.title-filter input',
    songsTable: '.mat-elevation-z8',
    tableHeaders: 'th',
    tableRows: 'td',
    editButtons: 'button[title="Edit Song"]',
    deleteButtons: 'button[title="Delete Song"]',
    paginator: 'mat-paginator'
  }

  getSongsTable() {
    return cy.get(this.elements.songsTable)
      .filter((index, table) => {
        return Cypress.$(table).find('th').filter((i, th) => th.textContent.includes('Title')).length > 0
      })
      .first()
  }

  visitAdminDashboard(){
    cy.visit('/home')
    cy.get('app-user-profile button[mat-icon-button]').click()
    cy.get('button').contains('Admin').click()
    cy.url().should('include', '/admin')
  }

  verifyAdminElements() {
    cy.get(this.elements.adminContainer).should('be.visible')
    cy.get(this.elements.addSongTitle).should('contain', 'Add New Song')
    
    this.getSongsTable()
      .should('be.visible')
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })
  }

  addSong(song) {
    cy.get(this.elements.titleInput).clear().type(song.title)
    cy.get(this.elements.artistSelect).first().click()

    cy.get('mat-option')
      .should('have.length.greaterThan', 0)
      .first()
      .click()

    cy.get('body').type('{esc}')
    cy.get(this.elements.dateInput).click().type(song.date)
    cy.get(this.elements.addSongButton).click()
  }

  searchSong(title) {
    cy.get(this.elements.searchField).clear().type(title)
    this.getSongsTable()
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })
  }

  editFirstSong(newTitle) {
    cy.get(this.elements.editButtons).first().click()

    cy.get('mat-dialog-container')
      .should('exist')
      .find('mat-form-field')
      .contains('mat-label', 'Title')
      .parents('mat-form-field')
      .find('input')
      .should('be.visible')
      .clear()
      .type(newTitle)

    cy.get(this.elements.editSongButton).click()
  }

  deleteFirstSong() {
    cy.get(this.elements.deleteButtons).first().click()
    cy.get('mat-dialog-container').should('be.visible')
    cy.get('mat-dialog-container mat-dialog-content')
      .should('contain.text', 'Are you sure you want to delete this song?')
    cy.get('mat-dialog-container mat-dialog-actions button[color="warn"]').click()
  }

  paginateNext() {
    this.getSongsTable()
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })

    cy.get('.admin-songs-container')  
      .find('mat-paginator')
      .first() 
      .as('myPaginator')

    cy.get('@myPaginator')
      .find('button[aria-label="Next page"]')
      .first()
      .click()


    this.getSongsTable()
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })

    return this
  }
}
export default new AdminSongsPage() 
