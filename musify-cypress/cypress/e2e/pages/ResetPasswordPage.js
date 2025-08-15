class ResetPasswordPage {
  elements = {
    title: 'h1, h2, .reset-password-title, [class*="title"]',
    tokenInput: 'input[placeholder*="Token"], input[name="token"], #token, .token-input',
    newPasswordInput: 'input[placeholder*="New Password"], input[name="newPassword"], #newPassword, .new-password-input, input[type="password"]',
    confirmPasswordInput: 'input[placeholder*="Confirm password"], input[name="confirmPassword"], #confirmPassword, .confirm-password-input, input[type="password"]',
    resetPasswordButton: 'button:contains("RESET PASSWORD"), button[type="submit"], .reset-password-btn',
    errorMessage: '[data-cy=error-message], .error-message, .alert, .notification',
    successMessage: '[data-cy=success-message], .success-message, .alert-success',
    passwordRequirements: '.password-requirements, .requirements-list, ul:contains("Password must contain")',
    eyeIcon: 'i[class*="eye"], button[class*="eye"], .password-toggle, [class*="eye"], svg[class*="eye"], .mat-icon'
  }

  visit(token) {
    const url = token ? `/reset-password?token=${token}` : '/reset-password'
    cy.visit(url, { failOnStatusCode: false })
    return this
  }

  verifyPageLoaded() {
    cy.get('h1, h2, [class*="title"]').should('contain.text', 'Reset Password')
    cy.get(this.elements.tokenInput).should('be.visible')
    
    cy.get('input[type="password"]').should('have.length.at.least', 2)
    
    cy.get(this.elements.resetPasswordButton).should('be.visible')
    cy.get(this.elements.passwordRequirements).should('be.visible')
    cy.url().should('include', '/reset-password')
    return this
  }

  fillToken(token) {
    cy.get(this.elements.tokenInput).should('be.visible').and('have.value', token)
    return this
  }

  fillNewPassword(password) {
    cy.get('input[type="password"]').first().should('be.visible').clear().type(password)
    return this
  }

  fillConfirmPassword(password) {
    cy.get('input[type="password"]').last().should('be.visible').clear().type(password)
    return this
  }

  clickResetPassword() {
    cy.get(this.elements.resetPasswordButton).should('be.visible').and('not.be.disabled').click()
    return this
  }

  submitResetPasswordForm(token, newPassword, confirmPassword) {
    this.fillToken(token)
      .fillNewPassword(newPassword)
      .fillConfirmPassword(confirmPassword)
      .clickResetPassword()
    cy.get(this.elements.resetPasswordButton).should('not.be.disabled')
    return this
  }

  togglePasswordVisibility(field = 'newPassword') {
    const passwordSelector = field === 'newPassword' ? 'input[type="password"]:first' : 'input[type="password"]:last'
    
    cy.get(passwordSelector).then(($input) => {
      const $container = $input.closest('div, form, .mat-form-field')
      if ($container.length) {
        cy.wrap($container).find(this.elements.eyeIcon).click()
      } else {
        cy.get(this.elements.eyeIcon).first().click()
      }
    })
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
      return text.includes('error') || text.includes('invalid') || text.includes('mismatch')
    })
    return this
  }

  verifyPasswordRequirements() {
    cy.get(this.elements.passwordRequirements).should('be.visible')
    cy.get(this.elements.passwordRequirements).should('contain.text', 'At least 8 characters')
    cy.get(this.elements.passwordRequirements).should('contain.text', 'At least one uppercase letter (A-Z)')
    cy.get(this.elements.passwordRequirements).should('contain.text', 'At least one lowercase letter (a-z)')
    cy.get(this.elements.passwordRequirements).should('contain.text', 'At least one number (0-9)')
    cy.get(this.elements.passwordRequirements).should('contain.text', 'At least one special character')
    return this
  }

  clearForm() {
    cy.get('input[type="password"]').first().clear()
    cy.get('input[type="password"]').last().clear()
    return this
  }

  verifyRedirectToLogin() {
    cy.url({ timeout: 10000 }).should('satisfy', (url) => {
      return url.includes('/login') || url.includes('/')
    })
    return this
  }
}

export default new ResetPasswordPage() 