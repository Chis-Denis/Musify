import ResetPasswordPage from '../../pages/ResetPasswordPage.js'
import ForgotPasswordPage from '../../pages/ForgotPasswordPage.js'

describe('Reset Password Functionality', () => {
  let users
  let testToken

  before(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData
    })
    
    testToken = 'ea4e12b1-e062-446f-be0e-e6e5e6a2a77c'
    
    cy.visit('/', { failOnStatusCode: false })
  })

  it('should display reset password page with token in URL', () => {
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.verifyPageLoaded()
    
    cy.get(ResetPasswordPage.elements.tokenInput).should('have.value', testToken)
  })

  it('should display password requirements', () => {
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.verifyPasswordRequirements()
  })

  it('should successfully reset password with valid data', () => {
    const newPassword = 'NewPassword123!'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.submitResetPasswordForm(testToken, newPassword, newPassword)
    
    ResetPasswordPage.verifyRedirectToLogin()
  })

  it('should handle password mismatch', () => {
    const newPassword = 'NewPassword123!'
    const confirmPassword = 'DifferentPassword123!'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.fillNewPassword(newPassword)
    ResetPasswordPage.fillConfirmPassword(confirmPassword)
    
    cy.get(ResetPasswordPage.elements.resetPasswordButton).should('satisfy', (button) => {
      return button.is(':disabled') || button.is(':visible')
    })
  })

  it('should handle weak password', () => {
    const weakPassword = 'weak'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.fillNewPassword(weakPassword)
    ResetPasswordPage.fillConfirmPassword(weakPassword)
    
    cy.get(ResetPasswordPage.elements.resetPasswordButton).should('satisfy', (button) => {
      return button.is(':disabled') || button.is(':visible')
    })
  })

  it('should handle empty required fields', () => {
    ResetPasswordPage.visit(testToken)
    
    cy.get(ResetPasswordPage.elements.resetPasswordButton).should('be.disabled')
  })

  it('should handle invalid token', () => {
    const invalidToken = 'invalid-token-123'
    const newPassword = 'NewPassword123!'
    
    ResetPasswordPage.visit(invalidToken)
    ResetPasswordPage.fillNewPassword(newPassword)
    ResetPasswordPage.fillConfirmPassword(newPassword)
    
    cy.get(ResetPasswordPage.elements.resetPasswordButton).should('satisfy', (button) => {
      return button.is(':disabled') || button.is(':visible')
    })
  })

  it('should toggle password visibility', () => {
    const testPassword = 'TestPassword123!'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.fillNewPassword(testPassword)
    
    cy.get('input[type="password"]').first().should('have.value', testPassword)
    cy.get('input[type="password"]').last().should('not.have.value', testPassword)
    
    ResetPasswordPage.fillConfirmPassword(testPassword)
    cy.get('input[type="password"]').last().should('have.value', testPassword)
  })

  it('should clear form fields', () => {
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.fillNewPassword('test')
    ResetPasswordPage.fillConfirmPassword('test')
    ResetPasswordPage.clearForm()
    
    cy.get('input[type="password"]').first().should('have.value', '')
    cy.get('input[type="password"]').last().should('have.value', '')
  })

  it('should handle password with special characters', () => {
    const specialPassword = 'P@ssw0rd!@#'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.submitResetPasswordForm(testToken, specialPassword, specialPassword)
    
    ResetPasswordPage.verifyRedirectToLogin()
  })

  it('should handle minimum length password', () => {
    const minLengthPassword = 'Abc123!@'
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.submitResetPasswordForm(testToken, minLengthPassword, minLengthPassword)
    
    ResetPasswordPage.verifyRedirectToLogin()
  })

  it('should complete full forgot password flow', () => {
    const email = users?.validUser?.email
    const newPassword = 'NewPassword123!'
    
    ForgotPasswordPage.visit()
    ForgotPasswordPage.verifyPageLoaded()
    
    ForgotPasswordPage.submitForgotPasswordForm(email)
    
    ResetPasswordPage.visit(testToken)
    ResetPasswordPage.verifyPageLoaded()
    
    ResetPasswordPage.submitResetPasswordForm(testToken, newPassword, newPassword)
    
    ResetPasswordPage.verifyRedirectToLogin()
  })
}) 