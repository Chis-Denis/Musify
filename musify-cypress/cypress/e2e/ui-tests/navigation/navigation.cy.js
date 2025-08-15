import HomePage from '../../pages/HomePage.js'
import SearchPage from '../../pages/SearchPage.js'
import LoginPage from '../../pages/LoginPage.js'

describe('Musify - Navigation Test', () => {
  let users

  before(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData

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
    })
  });

  it('Should navigate to Albums page via sidebar', () => {
    HomePage.navigateToAlbums()
  });

  it('Should navigate to Playlists page via sidebar', () => {
    HomePage.navigateToPlaylists()
  });

  it('Should perform a search from the top bar by pressing Enter', () => {
    SearchPage.performSearch('a')
  });

  it('Should verify profile menu elements are present', () => {
    HomePage.verifyProfileMenuElements()
  });

  it('Should navigate to Profile page via profile menu', () => {
    HomePage.navigateToProfile()
  });

  it('Should navigate to Change Password page via profile menu', () => {
    cy.visit('/home')
    HomePage.navigateToChangePassword()
  });

  it('Should logout via profile menu', () => {
    cy.visit('/home')
    HomePage.navigateToLogout()
  });
});
