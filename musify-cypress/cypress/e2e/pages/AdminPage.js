class AdminPage {
  
  elements = {
    adminContainer: '.admin-songs-container',
    formSection: '.form-section',
    addSongTitle: 'h3:contains("Add New Song")',
    titleInput: 'input[placeholder="Enter song title"]',
    artistSelect: 'mat-select[placeholder="Select Artists"]',
    dateInput: 'input[type="date"]',
    addSongButton: 'button:contains("Add Song")',
    tableSection: '.table-section',
    searchField: '.title-filter input',
    songsTable: 'table',
    tableHeaders: 'th',
    tableRows: 'tr',
    editButtons: 'button[title="Edit Song"]',
    deleteButtons: 'button[title="Delete Song"]',
    paginator: 'mat-paginator'
  }

  visit() {
    cy.visit('/admin', { failOnStatusCode: false })
    return this
  }

  isAdminPage() {
    cy.url().should('include', '/admin')
    cy.get(this.elements.adminContainer).should('be.visible')
    return this
  }

  verifyAdminElements() {
    cy.get(this.elements.adminContainer).should('be.visible')
    cy.get(this.elements.formSection).should('be.visible')
    cy.get(this.elements.addSongTitle).should('contain', 'Add New Song')
    cy.get(this.elements.tableSection).should('be.visible')
    cy.get(this.elements.songsTable).should('be.visible')
    return this
  }
}

export default new AdminPage() 