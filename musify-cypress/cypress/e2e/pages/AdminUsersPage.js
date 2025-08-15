class AdminUsersPage {
  static verifyAdminElements() {
    cy.contains('h3', 'Add New User').should('exist')
    cy.get('table').should('exist')
    cy.get('input[placeholder="Type email..."]').should('exist')
  }

  static searchUser(email) {
    cy.get('input[placeholder="Type email..."]').clear().type(email)
  }

  static getUsersTable() {
    return cy.get('table')
  }
}

export default AdminUsersPage
