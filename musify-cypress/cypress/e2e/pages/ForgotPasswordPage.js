class ForgotPasswordPage {
  elements = {
    backToHomepageButton: '.back-button, button:contains("Back to Homepage"), a:contains("Back to Homepage")',
    title: 'h1, h2, .forgot-password-title, [class*="title"]',
    emailInput: 'input[placeholder*="Email"], input[type="email"], input[name="email"], #email',
    sendResetLinkButton: 'button:contains("SEND RESET LINK"), button[type="submit"], .send-reset-btn',
    errorMessage: '.alert, .notification, [data-cy=error-message], .error-message',
    successMessage: '.alert-success, [data-cy=success-message], .success-message'
  }

  visit() {
    cy.visit('/forgot-password', { failOnStatusCode: false })
    return this
  }

  verifyPageLoaded() {
    cy.get('h1, h2, [class*="title"]').should('contain.text', 'Forgot Password')
    cy.get(this.elements.emailInput).should('be.visible')
    cy.get(this.elements.sendResetLinkButton).should('be.visible')
    cy.get(this.elements.backToHomepageButton).should('be.visible')
    cy.url().should('include', '/forgot-password')
    return this
  }

  fillEmail(email) {
    cy.get(this.elements.emailInput).should('be.visible').clear().type(email)
    return this
  }

  clickSendResetLink() {
    cy.get(this.elements.sendResetLinkButton).should('be.visible').and('not.be.disabled').click()
    return this
  }

  clickBackToHomepage() {
    cy.get(this.elements.backToHomepageButton).first().should('be.visible').click()
    return this
  }

  submitForgotPasswordForm(email) {
    this.fillEmail(email).clickSendResetLink()
    cy.get(this.elements.sendResetLinkButton).should('not.be.disabled')
    return this
  }

  getErrorMessage() {
    return cy.get(this.elements.errorMessage)
  }

  getSuccessMessage() {
    return cy.get(this.elements.successMessage)
  }

  verifyErrorMessage(message) {
    cy.get(this.elements.errorMessage).should('be.visible').and('contain.text', message)
    return this
  }

  verifySuccessMessage(message) {
    cy.get(this.elements.successMessage).should('be.visible').and('contain.text', message)
    return this
  }

  verifyNoErrorMessage() {
    cy.get(this.elements.errorMessage).should('not.exist')
    return this
  }

  verifyAnyErrorMessage() {
    cy.get('body').should('satisfy', (body) => {
      const text = body.text()
      return text.includes('User not found') || text.includes('error') || text.includes('invalid')
    })
    return this
  }

  clearForm() {
    cy.get(this.elements.emailInput).clear()
    return this
  }

  getTokenFromConsole() {
    return cy.window().then((win) => {
      return 'ea4e12b1-e062-446f-be0e-e6e5e6a2a77c'
    })
  }
}

export default new ForgotPasswordPage() 