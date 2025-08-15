import ChangePasswordPage from '../../pages/ChangePasswordPage.js'
import HomePage from '../../pages/HomePage.js'
import LoginPage from '../../pages/LoginPage.js'

describe('Musify - Change Password Test', () => {
  let users
  let passwords

  before(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData

      const email = usersData.validUser2?.email
      const password = usersData.validUser2?.password

      if (!email || !password) {
        throw new Error('Invalid test credentials - email or password is missing')
      }

      LoginPage.visit()
      LoginPage.fillEmail(email)
      LoginPage.fillPassword(password)
      LoginPage.clickLogin()
      
      cy.url().should('not.include', '/login')
    })
    
    cy.fixture('passwords').then((passwordsData) => {
      passwords = passwordsData
    })
  });

  it('Should navigate to Change Password page and verify all elements', () => {
    cy.get('body').then(($body) => {
      const accountIcons = $body.find('mat-icon').filter((index, element) => {
        return Cypress.$(element).text().includes('account_circle')
      })
      
      if (accountIcons.length > 0) {
        HomePage.navigateToChangePassword()
      } else {
        cy.log('Profile menu not available, navigating directly')
        ChangePasswordPage.visit()
      }
    })
    
    ChangePasswordPage.verifyChangePasswordPage()
  });

  it('Should verify Change Password form elements are present', () => {
    // Try to visit with better error handling
    cy.visit('/change-password', { 
      failOnStatusCode: false,
      timeout: 30000 // Increase timeout to 30 seconds
    })
    
    // Wait for the page to load properly
    cy.get('body').should('be.visible', { timeout: 15000 })
    
    // Verify we're on the correct page
    cy.url().should('include', '/change-password', { timeout: 10000 })
    
    ChangePasswordPage.verifyFormElements()
  });

  it('Should fill Change Password form with valid data', () => {
    cy.visit('/change-password', { 
      failOnStatusCode: false,
      timeout: 30000
    })
    cy.get('body').should('be.visible', { timeout: 15000 })
    cy.url().should('include', '/change-password', { timeout: 10000 })
    
    ChangePasswordPage.fillCurrentPassword(passwords.currentPassword)
    ChangePasswordPage.fillNewPassword(passwords.newPassword)
    ChangePasswordPage.fillConfirmPassword(passwords.newPassword)
  });

  it('Should attempt to change password with matching passwords', () => {
    cy.visit('/change-password', { 
      failOnStatusCode: false,
      timeout: 30000
    })
    cy.get('body').should('be.visible', { timeout: 15000 })
    cy.url().should('include', '/change-password', { timeout: 10000 })
    
    ChangePasswordPage.changePassword(passwords.currentPassword, passwords.newPassword, passwords.newPassword)
  });

  it('Should attempt to change password with non-matching passwords', () => {
    cy.visit('/change-password', { 
      failOnStatusCode: false,
      timeout: 30000
    })
    cy.get('body').should('be.visible', { timeout: 15000 })
    cy.url().should('include', '/change-password', { timeout: 10000 })
    
    ChangePasswordPage.fillCurrentPassword(passwords.currentPassword)
    ChangePasswordPage.fillNewPassword(passwords.newPassword)
    ChangePasswordPage.fillConfirmPassword(passwords.differentPassword)
    ChangePasswordPage.clickChangePassword()
    ChangePasswordPage.verifyErrorMessages()
  });

  it('Should navigate back to homepage from Change Password page', () => {
    cy.visit('/change-password', { 
      failOnStatusCode: false,
      timeout: 30000
    })
    cy.get('body').should('be.visible', { timeout: 15000 })
    cy.url().should('include', '/change-password', { timeout: 10000 })
    
    ChangePasswordPage.clickBackButton()
    cy.url().should('not.include', '/change-password')
  });

  it('Should verify Change Password page URL and title', () => {
    cy.visit('/change-password', { 
      failOnStatusCode: false,
      timeout: 30000
    })
    cy.get('body').should('be.visible', { timeout: 15000 })
    cy.url().should('include', '/change-password', { timeout: 10000 })
    
    cy.get('body').then(($body) => {
      const titleSelectors = [
        'h3:contains("Change Password")',
        'h1:contains("Change Password")', 
        'h2:contains("Change Password")',
        'h4:contains("Change Password")',
        'h5:contains("Change Password")',
        'h6:contains("Change Password")',
        'div:contains("Change Password")',
        'span:contains("Change Password")',
        'p:contains("Change Password")',
        'label:contains("Change Password")'
      ]
      
      let titleFound = false
      for (const selector of titleSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector, { timeout: 10000 }).should('be.visible')
          titleFound = true
          break
        }
      }
      
      if (!titleFound) {
        cy.get('body').should('contain', 'Change Password')
        cy.log('Title text found in page content, but not in specific heading element')
      }
    })
  });
}); 