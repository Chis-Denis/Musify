import ProfilePage from '../../pages/ProfilePage'
import { login } from '../../utils/loginUtils.js'

describe('Profile Page - Tests as Logged-in User', () => {
  let users
  let currentUser

  before(() => {
    cy.fixture('users').then(userData => {
      users = userData
      currentUser = users.adminUser21

      login(currentUser.email, currentUser.password)

      cy.visit('/home')
      cy.get('app-user-profile button[mat-icon-button]').click()
      cy.get('button').contains('Profile').click()
      cy.url().should('include', '/profile')
      cy.get('mat-card-title').should('be.visible') 
    })
  })

  it('should display profile page with all expected elements', () => {
    ProfilePage.verifyProfilePage()
    ProfilePage.verifyProfileElements()
  })

  it('should display correct user name and email', () => {
    ProfilePage.getUserName().should('contain.text', currentUser.name)
    ProfilePage.getUserEmail().should('contain.text', currentUser.email)
  })

  it('should display user role and country', () => {
    ProfilePage.verifyUserInfo()
  })

  it('should open update profile component', () => {
    ProfilePage.openUpdateProfile()
    cy.get('app-update-profile').should('exist')
  })

  it('should update profile information and show success notification', () => {
  const newFirstName = 'TestFirst'
  const newLastName = 'TestLast'
  const newEmail = 'tests.user@musify.com'
  const newCountry = 'Germany'

  ProfilePage.openUpdateProfile()
  cy.get('app-update-profile').should('be.visible')

  cy.get('input[name="firstName"]').clear().type(newFirstName)
  cy.get('input[name="lastName"]').clear().type(newLastName)
  cy.get('input[name="email"]').clear().type(newEmail)
  cy.get('input[name="country"]').clear().type(newCountry)

  cy.get('button').filter((i, el) => {
    return el.innerText.trim().toLowerCase() === 'save changes'
  }).click()

  cy.contains('User updated successfully')
  .should('exist')

})

  it('should open delete account component', () => {
    ProfilePage.openDeleteAccount()
    cy.get('app-delete-account').should('exist')
  })

  it('should delete profile', () => {

  cy.get('button').filter((i, el) => {
    return el.innerText.trim().toLowerCase() === 'yes, delete my account'
  }).click()

  cy.contains('User deleted successfully')
  .should('exist')
})

  it('should navigate back when back button is clicked', () => {
    ProfilePage.clickBackButton()
    cy.url().should('not.include', '/profile')
  })

})
