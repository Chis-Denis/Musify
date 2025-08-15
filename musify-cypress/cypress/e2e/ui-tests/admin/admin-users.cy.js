import AdminUsersPage from '../../pages/AdminUsersPage'
import { login } from '../../utils/loginUtils.js'

describe('Admin Users - Test for users', () => {
  let users

before(() => {
  cy.fixture('users').then(userData => {
    users = userData

    const email = users.adminUser5.email
    const password = users.adminUser5.password

    login(email, password)

    cy.visit('/home') // 🔹 First go to home
    cy.wait(500)      // optionally wait for home to render

    cy.visit('/admin') // 🔹 Then go to admin (or click link if needed)

    cy.contains('Users').click()
  })
})


  it('should display admin users page', () => {
    AdminUsersPage.verifyAdminElements()
  })

  it('should search users by email', () => {
    cy.searchUser(users.searchUser.email)
  })

  it('should paginate through the users table', () => {
    cy.paginateNext()
  })
})
