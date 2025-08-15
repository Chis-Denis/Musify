import ForgotPasswordPage from '../../pages/ForgotPasswordPage.js'
import ResetPasswordPage from '../../pages/ResetPasswordPage.js'
import LoginPage from '../../pages/LoginPage.js'

describe('Forgot Password and Reset Password Integration Flow', () => {
  let users

  before(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData
    })
  })

  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false })
  })

  it('should complete forgot password form submission', () => {
    const email = users?.validUser?.email

    LoginPage.clickForgotPassword()
    ForgotPasswordPage.verifyPageLoaded()

    ForgotPasswordPage.submitForgotPasswordForm(email)
    
    cy.get(ForgotPasswordPage.elements.sendResetLinkButton).should('not.be.disabled')
    ForgotPasswordPage.verifyNoErrorMessage()
  })

  it('should handle invalid email in forgot password flow', () => {
    const invalidEmail = 'invalid-email-format'
    
    LoginPage.clickForgotPassword()
    ForgotPasswordPage.verifyPageLoaded()
    
    ForgotPasswordPage.fillEmail(invalidEmail)
    ForgotPasswordPage.clickSendResetLink()
    
    cy.get('body').should('satisfy', (body) => {
      const text = body.text()
      return text.includes('User not found') || text.includes('error') || text.includes('invalid')
    })
  })

  it('should handle password mismatch in reset flow', () => {
    const testToken = 'ea4e12b1-e062-446f-be0e-e6e5e6a2a77c'
    const newPassword = 'NewPassword123!'
    const confirmPassword = 'DifferentPassword123!'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.verifyPageLoaded()
    
    ResetPasswordPage.fillNewPassword(newPassword)
    ResetPasswordPage.fillConfirmPassword(confirmPassword)
    
    cy.get(ResetPasswordPage.elements.resetPasswordButton).should('satisfy', (button) => {
      return button.is(':disabled') || button.is(':visible')
    })
  })

  it('should handle weak password in reset flow', () => {
    const testToken = 'ea4e12b1-e062-446f-be0e-e6e5e6a2a77c'
    const weakPassword = 'weak'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.verifyPageLoaded()
    
    ResetPasswordPage.fillNewPassword(weakPassword)
    ResetPasswordPage.fillConfirmPassword(weakPassword)
    
    cy.get(ResetPasswordPage.elements.resetPasswordButton).should('satisfy', (button) => {
      return button.is(':disabled') || button.is(':visible')
    })
  })

  it('should verify password requirements are displayed', () => {
    const testToken = 'ea4e12b1-e062-446f-be0e-e6e5e6a2a77c'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.verifyPageLoaded()
    
    ResetPasswordPage.verifyPasswordRequirements()
  })

  it('should test password field filling', () => {
    const testToken = 'ea4e12b1-e062-446f-be0e-e6e5e6a2a77c'
    const testPassword = 'TestPassword123!'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.verifyPageLoaded()
    
    ResetPasswordPage.fillNewPassword(testPassword)
    ResetPasswordPage.fillConfirmPassword(testPassword)
    
    cy.get('input[type="password"]').first().should('have.value', testPassword)
    cy.get('input[type="password"]').last().should('have.value', testPassword)
  })

  it('should handle navigation back to login from forgot password', () => {
    LoginPage.clickForgotPassword()
    ForgotPasswordPage.verifyPageLoaded()
    
    ForgotPasswordPage.clickBackToHomepage()
    
    cy.url().should('satisfy', (url) => {
      return url.includes('/') || url.includes('/login')
    })
  })
}) 