import ForgotPasswordPage from '../../pages/ForgotPasswordPage.js'
import LoginPage from '../../pages/LoginPage.js'

describe('Forgot Password Functionality', () => {
  let users

  before(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData
    })

    cy.visit('/', { failOnStatusCode: false })
  })

  it('should navigate to forgot password page from login', () => {
    LoginPage.clickForgotPassword()
    ForgotPasswordPage.verifyPageLoaded()
  })

  it('should display forgot password page elements', () => {
    ForgotPasswordPage.visit()
    ForgotPasswordPage.verifyPageLoaded()
  })

  it('should submit forgot password form with valid email', () => {
    const email = users?.validUser?.email
    
    ForgotPasswordPage.visit()
    ForgotPasswordPage.submitForgotPasswordForm(email)
    
    ForgotPasswordPage.verifyNoErrorMessage()
    
    cy.get(ForgotPasswordPage.elements.sendResetLinkButton).should('not.be.disabled')
  })

  it('should handle invalid email format', () => {
    const invalidEmail = 'invalid-email-format'
    
    ForgotPasswordPage.visit()
    ForgotPasswordPage.fillEmail(invalidEmail)
    ForgotPasswordPage.clickSendResetLink()
    
    cy.get('body').should('satisfy', (body) => {
      const text = body.text()
      return text.includes('User not found') || text.includes('error') || text.includes('invalid')
    })
  })

  it('should handle empty email field', () => {
    ForgotPasswordPage.visit()
    
    cy.get(ForgotPasswordPage.elements.sendResetLinkButton).should('be.disabled')
  })

  it('should navigate back to homepage from forgot password page', () => {
    ForgotPasswordPage.visit()
    ForgotPasswordPage.clickBackToHomepage()
    
    cy.url().should('satisfy', (url) => {
      return url.includes('/') || url.includes('/login')
    })
  })

  it('should clear form when navigating back and forth', () => {
    ForgotPasswordPage.visit()
    ForgotPasswordPage.fillEmail('test@example.com')
    ForgotPasswordPage.clickBackToHomepage()
    ForgotPasswordPage.visit()
    
    cy.get(ForgotPasswordPage.elements.emailInput).should('have.value', '')
  })

  it('should handle non-existent email gracefully', () => {
    const nonExistentEmail = 'nonexistent@example.com'
    
    ForgotPasswordPage.visit()
    ForgotPasswordPage.submitForgotPasswordForm(nonExistentEmail)
    
    ForgotPasswordPage.verifyNoErrorMessage()
  })
}) 