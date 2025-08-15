import LoginPage from '../pages/LoginPage.js'

export const login = (email, password) => {
  cy.session([email, password], () => {
    LoginPage.visit()
    LoginPage.fillEmail(email)
    LoginPage.fillPassword(password)
    LoginPage.clickLogin()
    cy.url().should('not.include', '/login')
    cy.getCookie('token', { timeout: Cypress.env('LOGIN_TIMEOUT') }).should('exist')

  }, {
    validate() {
      cy.getCookie('token').should('exist') 
      cy.url().should('not.eq', Cypress.config().baseUrl + '/')
    },  
    cacheAcrossSpecs: true
  })
}