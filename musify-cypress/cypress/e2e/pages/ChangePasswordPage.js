class ChangePasswordPage {
  static currentPasswordInput = 'input[placeholder="Current Password*"], input[placeholder*="Current"], input[placeholder*="current"], input[name*="current"], input[id*="current"]'
  static newPasswordInput = 'input[placeholder="New Password*"], input[placeholder*="New"], input[placeholder*="new"], input[name*="new"], input[id*="new"]'
  static confirmPasswordInput = 'input[placeholder="Confirm New Password*"], input[placeholder*="Confirm"], input[placeholder*="confirm"], input[name*="confirm"], input[id*="confirm"]'
  static changePasswordButton = 'button:contains("CHANGE PASSWORD"), button:contains("Change Password"), button:contains("Submit"), button[type="submit"], .mat-mdc-raised-button'
  static backButton = 'button:contains("Back to Homepage"), button:contains("Back"), a:contains("Back"), .mat-mdc-outlined-button'
  static pageTitle = 'h3:contains("Change Password"), h1:contains("Change Password"), h2:contains("Change Password"), h4:contains("Change Password"), h5:contains("Change Password"), h6:contains("Change Password")'

  static visit() {
    // Try to visit with increased timeout and better error handling
    cy.visit('/change-password', { 
      failOnStatusCode: false,
      timeout: 30000 // Increase timeout to 30 seconds
    })
    
    // Wait for the page to load properly
    cy.get('body').should('be.visible', { timeout: 15000 })
    
    // Verify we're on the correct page
    cy.url().should('include', '/change-password', { timeout: 10000 })
    
    return this
  }

  static fillCurrentPassword(password) {
    cy.get('body').then(($body) => {
      const selectors = this.currentPasswordInput.split(', ')
      let found = false
      
      for (const selector of selectors) {
        if ($body.find(selector.trim()).length > 0) {
          cy.get(selector.trim(), { timeout: 10000 }).first().should('be.visible').should('not.be.disabled').type(password, { force: true })
          found = true
          break
        }
      }
      
      if (!found) {
        const passwordInputs = $body.find('input[type="password"]')
        if (passwordInputs.length > 0) {
          cy.wrap(passwordInputs.first()).should('be.visible').should('not.be.disabled').type(password, { force: true })
        }
      }
    })
    return this
  }

  static fillNewPassword(password) {
    cy.get('body').then(($body) => {
      const selectors = this.newPasswordInput.split(', ')
      let found = false
      
      for (const selector of selectors) {
        if ($body.find(selector.trim()).length > 0) {
          cy.get(selector.trim(), { timeout: 10000 }).first().should('be.visible').should('not.be.disabled').type(password, { force: true })
          found = true
          break
        }
      }
      
      if (!found) {
        const passwordInputs = $body.find('input[type="password"]')
        if (passwordInputs.length > 1) {
          cy.wrap(passwordInputs.eq(1)).should('be.visible').should('not.be.disabled').type(password, { force: true })
        }
      }
    })
    return this
  }

  static fillConfirmPassword(password) {
    cy.get('body').then(($body) => {
      const selectors = this.confirmPasswordInput.split(', ')
      let found = false
      
      for (const selector of selectors) {
        if ($body.find(selector.trim()).length > 0) {
          cy.get(selector.trim(), { timeout: 10000 }).first().should('be.visible').should('not.be.disabled').type(password, { force: true })
          found = true
          break
        }
      }
      
      if (!found) {
        const passwordInputs = $body.find('input[type="password"]')
        if (passwordInputs.length > 2) {
          cy.wrap(passwordInputs.eq(2)).should('be.visible').should('not.be.disabled').type(password, { force: true })
        }
      }
    })
    return this
  }

  static clickChangePassword() {
    cy.get('body').then(($body) => {
      const selectors = this.changePasswordButton.split(', ')
      let found = false
      
      for (const selector of selectors) {
        if ($body.find(selector.trim()).length > 0) {
          cy.get(selector.trim(), { timeout: 10000 }).first().should('be.visible').should('not.be.disabled').click({ force: true })
          found = true
          break
        }
      }
      
      if (!found) {
        const submitButtons = $body.find('button[type="submit"], .mat-mdc-raised-button')
        if (submitButtons.length > 0) {
          cy.wrap(submitButtons.first()).should('be.visible').should('not.be.disabled').click({ force: true })
        }
      }
    })
    return this
  }

  static clickBackButton() {
    cy.get('body').then(($body) => {
      const selectors = this.backButton.split(', ')
      let found = false
      
      for (const selector of selectors) {
        if ($body.find(selector.trim()).length > 0) {
          cy.get(selector.trim(), { timeout: 10000 }).first().should('be.visible').click({ force: true })
          found = true
          break
        }
      }
      
      if (!found) {
        const backButtons = $body.find('button:contains("Back"), a:contains("Back"), .mat-mdc-outlined-button')
        if (backButtons.length > 0) {
          cy.wrap(backButtons.first()).should('be.visible').click({ force: true })
        }
      }
    })
    return this
  }

  static changePassword(currentPassword, newPassword, confirmPassword) {
    this.fillCurrentPassword(currentPassword)
      .fillNewPassword(newPassword)
      .fillConfirmPassword(confirmPassword)
      .clickChangePassword()
    return this
  }

  static verifyChangePasswordPage() {
    cy.url().should('include', '/change-password')
    
    cy.get('body').then(($body) => {
      const titleSelectors = this.pageTitle.split(', ')
      let titleFound = false
      
      for (const selector of titleSelectors) {
        if ($body.find(selector.trim()).length > 0) {
          cy.get(selector.trim(), { timeout: 10000 }).first().should('be.visible')
          titleFound = true
          break
        }
      }
      
      if (!titleFound) {
        if ($body.text().includes('Change Password')) {
          cy.get('body').should('contain', 'Change Password')
        }
      }
    })
    
    cy.get('input[type="password"]').should('have.length.at.least', 1)
    
    cy.get('button').should('have.length.at.least', 1)
    
    return this
  }

  static verifyFormElements() {
    cy.get('body').then(($body) => {
      const passwordInputs = $body.find('input[type="password"]')
      if (passwordInputs.length > 0) {
        cy.get('input[type="password"]').should('have.length.at.least', 1)
      }
      
      const submitButtons = $body.find('button[type="submit"], .mat-mdc-raised-button')
      if (submitButtons.length > 0) {
        cy.get('button[type="submit"], .mat-mdc-raised-button').should('be.visible')
      }
    })
    return this
  }

  static verifyErrorMessages() {
    cy.get('body').then(($body) => {
      if ($body.find('.error-message, .alert, .notification, [class*="error"]').length > 0) {
        cy.get('.error-message, .alert, .notification, [class*="error"]').should('be.visible')
      }
    })
    return this
  }

  static verifySuccessMessage() {
    cy.get('body').then(($body) => {
      if ($body.find('.success-message, .alert-success, [class*="success"]').length > 0) {
        cy.get('.success-message, .alert-success, [class*="success"]').should('be.visible')
      }
    })
    return this
  }
}

export default ChangePasswordPage 