import HomePage from '../../pages/HomePage.js'
import LogoutPage from '../../pages/LogoutPage.js'
import LoginPage from '../../pages/LoginPage.js'

describe('Musify - Logout Test', () => {
  let users

  before(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData
    })
  });

  beforeEach(() => {
    const email = users.validUser2?.email
    const password = users.validUser2?.password

    if (!email || !password) {
      throw new Error('Invalid test credentials - email or password is missing')
    }

    LoginPage.visit()
    LoginPage.fillEmail(email)
    LoginPage.fillPassword(password)
    LoginPage.clickLogin()
    
    cy.url().should('not.include', '/login')
  });

  it('Should logout and verify complete logout process', () => {
    HomePage.navigateToLogout()
    LogoutPage.verifyLogoutSuccessWithFallback()
  });

  it('Should verify login page elements after logout', () => {
    HomePage.navigateToLogout()
    LogoutPage.verifyLoginPageElements()
  });

  it('Should verify authentication is properly cleared', () => {
    HomePage.navigateToLogout()
    LogoutPage.verifyAuthenticationCleared()
  });

  it('Should verify redirect to login page', () => {
    HomePage.navigateToLogout()
    LogoutPage.verifyLoginPageRedirect()
  });

  it('Should verify logout using custom command', () => {
    HomePage.navigateToLogout()
    cy.verifyLogout()
  });

  it('Should verify logout with fallback when navigation fails', () => {
    LogoutPage.verifyLogoutSuccessWithFallback()
  });

  it('Should verify logout using LoginPage method', () => {
    HomePage.navigateToLogout()
    LogoutPage.verifyLogoutUsingLoginPage()
  });

  it('Should verify logout using custom command with LoginPage', () => {
    HomePage.navigateToLogout()
    cy.verifyLogoutUsingLoginPage()
  });
}); 