class LoginPage {
  elements = {
    emailInput: 'input[placeholder*="email"], input[placeholder*="Email"], input[name="email"], input[type="email"], #email, .email-input',
    passwordInput: 'input[placeholder*="password"], input[placeholder*="Password"], input[name="password"], input[type="password"], #password, .password-input',
    loginButton: 'button:contains("Login"), button[type="submit"], input[type="submit"], .login-btn, .submit-btn, .mat-mdc-raised-button',
    errorMessage: '[data-cy=error-message], .error-message, .alert, .notification',
    forgotPasswordLink: 'a:contains("Forgot"), a:contains("password"), .forgot-password',
    signupLink: 'a:contains("Register"), a:contains("Sign Up"), .signup-link'
  }

  visit() {
    cy.visit('/', { failOnStatusCode: false })
    return this
  }

  fillEmail(email) {
    cy.get(this.elements.emailInput).first().should('be.visible').type(email)
    return this
  }

  fillPassword(password) {
    cy.get(this.elements.passwordInput).first().should('be.visible').type(password)
    return this
  }

  clickLogin() {
    cy.get(this.elements.loginButton).first().should('be.visible').click({ timeout: 10000 })
    return this
  }

  login(email, password) {
    this.fillEmail(email).fillPassword(password).clickLogin()
    cy.url().should('not.eq', Cypress.config().baseUrl + '/')
    return this
  }

  clearForm() {
    cy.get(this.elements.emailInput).first().clear()
    cy.get(this.elements.passwordInput).first().clear()
    return this
  }

  clickForgotPassword() {
    cy.get(this.elements.forgotPasswordLink).first().click()
    return this
  }

  clickSignup() {
    cy.get(this.elements.signupLink).first().click()
    return this
  }

  getErrorMessage() {
    return cy.get(this.elements.errorMessage)
  }

  isLoginPage() {
    cy.get(this.elements.emailInput).first().should('be.visible')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    return this
  }
}

export default new LoginPage() 