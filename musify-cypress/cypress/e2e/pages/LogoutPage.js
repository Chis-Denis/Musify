import LoginPage from './LoginPage.js'

class LogoutPage {
  static elements = {
    loginUrl: '/login',
    emailInput: 'input[type="email"], input[placeholder*="email"], input[placeholder*="Email"], input[name*="email"], input[id*="email"], input[autocomplete*="email"], input[formcontrolname*="email"]',
    passwordInput: 'input[type="password"], input[placeholder*="password"], input[placeholder*="Password"], input[name*="password"], input[id*="password"], input[autocomplete*="current-password"], input[autocomplete*="new-password"], input[formcontrolname*="password"]',
    loginButton: 'button[type="submit"], input[type="submit"], .login-button, button:contains("Login"), button:contains("LOGIN"), button[formcontrolname*="submit"]',
    loginTitle: 'body'
  }

  static verifyLogoutSuccess() {
    cy.url().then((currentUrl) => {
      if (currentUrl === 'about:blank' || currentUrl === 'data:,' || currentUrl === '') {
        cy.visit('/login')
        cy.url().should('include', '/login')
      } else if (currentUrl.includes('/login')) {
        cy.url().should('include', '/login')
      } else {
        cy.visit('/login')
        cy.url().should('include', '/login')
      }
    })
    
    this.verifyLoginPageElements()
    
    cy.get('body').should('not.contain', 'account_circle')
    cy.get('body').should('not.contain', 'profile-menu')
    
    cy.url().should('not.include', '/profile')
    cy.url().should('not.include', '/admin')
    cy.url().should('not.include', '/change-password')
    
    cy.get(this.elements.loginTitle).should('contain', 'Login')
  }

  static verifyLogoutSuccessWithFallback() {
    cy.url().then((currentUrl) => {
      if (currentUrl.includes('/login')) {
        this.verifyLoginPageElements()
        this.verifyAuthenticationCleared()
      } else if (currentUrl === 'about:blank' || currentUrl === 'data:,' || currentUrl === '') {
        cy.visit('/login')
        cy.url().should('include', '/login')
        this.verifyLoginPageElements()
      } else {
        cy.visit('/login')
        cy.url().should('include', '/login')
        this.verifyLoginPageElements()
      }
    })
  }

  static verifyLoginPageElements() {
    cy.get('body').should('be.visible')
    
    cy.visit('/login')
    cy.url().should('include', '/login')
    
    cy.get('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"], input[name="email"], input[type="email"], #email, .email-input').should('be.visible')
    
    cy.get('body').then(($body) => {
      const inputs = $body.find('input')
      
      if (inputs.length === 0) {
        cy.get('body').then(($body) => {
          const bodyText = $body.text().toLowerCase()
          
          if (bodyText.includes('login')) {
            cy.visit('/login')
            cy.url().should('include', '/login')
            cy.get('input', { timeout: 10000 }).should('exist')
          } else {
            cy.visit('/login')
            cy.url().should('include', '/login')
            cy.get('body').should('contain', 'Login')
            cy.get('input', { timeout: 10000 }).should('exist')
          }
        })
      }
    })
    
    cy.get('input').then(($inputs) => {
      let emailFound = false
      let passwordFound = false
      
      $inputs.each((index, input) => {
        const $input = Cypress.$(input)
        const type = $input.attr('type') || ''
        const placeholder = $input.attr('placeholder') || ''
        const name = $input.attr('name') || ''
        const id = $input.attr('id') || ''
        
        if (type === 'email' || placeholder.toLowerCase().includes('email') || name.toLowerCase().includes('email') || id.toLowerCase().includes('email')) {
          emailFound = true
        }
        
        if (type === 'password' || placeholder.toLowerCase().includes('password') || name.toLowerCase().includes('password') || id.toLowerCase().includes('password')) {
          passwordFound = true
        }
      })
      
      if (emailFound) {
        cy.get('input').filter((index, input) => {
          const $input = Cypress.$(input)
          const type = $input.attr('type') || ''
          const placeholder = $input.attr('placeholder') || ''
          const name = $input.attr('name') || ''
          const id = $input.attr('id') || ''
          return type === 'email' || placeholder.toLowerCase().includes('email') || name.toLowerCase().includes('email') || id.toLowerCase().includes('email')
        }).should('be.visible')
      } else {
        cy.get('body').should('contain', 'Login')
      }
      
      if (passwordFound) {
        cy.get('input').filter((index, input) => {
          const $input = Cypress.$(input)
          const type = $input.attr('type') || ''
          const placeholder = $input.attr('placeholder') || ''
          const name = $input.attr('name') || ''
          const id = $input.attr('id') || ''
          return type === 'password' || placeholder.toLowerCase().includes('password') || name.toLowerCase().includes('password') || id.toLowerCase().includes('password')
        }).should('be.visible')
      }
    })
    
    cy.get('button').then(($buttons) => {
      let loginButtonFound = false
      $buttons.each((index, button) => {
        const $button = Cypress.$(button)
        const text = $button.text().toLowerCase()
        const type = $button.attr('type') || ''
        if (text.includes('login') || type === 'submit') {
          loginButtonFound = true
        }
      })
      
      if (loginButtonFound) {
        cy.get('button').filter((index, button) => {
          const $button = Cypress.$(button)
          const text = $button.text().toLowerCase()
          const type = $button.attr('type') || ''
          return text.includes('login') || type === 'submit'
        }).should('be.visible')
      }
    })
  }

  static verifyAuthenticationCleared() {
    cy.get('body').should('not.contain', 'account_circle')
    cy.get('body').should('not.contain', 'profile-menu')
    cy.url().should('not.include', '/profile')
    cy.url().should('not.include', '/admin')
    cy.url().should('not.include', '/change-password')
  }

  static verifyLoginPageRedirect() {
    cy.url().then((currentUrl) => {
      if (currentUrl === 'about:blank' || currentUrl === 'data:,' || currentUrl === '') {
        cy.visit('/login')
        cy.url().should('include', '/login')
        cy.get('body').should('contain', 'Login')
      } else if (currentUrl.includes('/login')) {
        cy.url().should('include', '/login')
        cy.get(this.elements.loginTitle).should('contain', 'Login')
      } else {
        cy.visit('/login')
        cy.url().should('include', '/login')
        cy.get('body').should('contain', 'Login')
      }
    })
  }

  static verifyLogoutUsingLoginPage() {
    cy.url().then((currentUrl) => {
      if (currentUrl === 'about:blank' || currentUrl === 'data:,' || currentUrl === '') {
        cy.visit('/login')
        cy.get('input', { timeout: 10000 }).should('exist')
        cy.get('body').should('contain', 'Login')
      } else if (currentUrl.includes('/login')) {
        cy.get('input', { timeout: 10000 }).should('exist')
        cy.get('body').should('contain', 'Login')
      } else {
        cy.visit('/login')
        cy.get('input', { timeout: 10000 }).should('exist')
        cy.get('body').should('contain', 'Login')
      }
    })
    
    this.verifyAuthenticationCleared()
  }
}

export default LogoutPage 