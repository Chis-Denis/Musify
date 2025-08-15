import SearchPage from '../../pages/SearchPage.js'
import LoginPage from '../../pages/LoginPage.js'

describe('Musify - Search Test', () => {
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

      cy.visit('/home', { failOnStatusCode: false })
      cy.url().should('include', '/home')
    })
  });

  it('Should verify search input is present on home page', () => {
    cy.url().should('include', '/home')
    
    SearchPage.verifySearchInput()
  });

  it('Should perform a search with single character from home page', () => {
    cy.url().should('include', '/home')
    
    SearchPage.performSearch('a')
    
    SearchPage.verifySearchResults()

    cy.wait(1000)
  });

  it('Should perform a search with multiple characters from home page', () => {
    cy.url().should('include', '/home')
    
    SearchPage.performSearch('test')
    
    SearchPage.verifySearchResults()
  });

  it('Should perform a search with song name from home page', () => {
    cy.url().should('include', '/home')
    
    SearchPage.performSearch('song')
    
    SearchPage.verifySearchResults()
  });

  it('Should perform a search with artist name from home page', () => {
    cy.url().should('include', '/home')
    
    SearchPage.performSearch('artist')
    
    SearchPage.verifySearchResults()
  });

  it('Should perform a search with album name from home page', () => {
    cy.url().should('include', '/home')
    
    SearchPage.performSearch('album')
    
    SearchPage.verifySearchResults()
  });

  it('Should verify search functionality with different terms from home page', () => {
    cy.url().should('include', '/home')
    
    const searchTerms = ['song', 'artist', 'album', 'playlist']
    
    searchTerms.forEach(term => {
      cy.visit('/home', { failOnStatusCode: false })
      cy.url().should('include', '/home')
      
      SearchPage.performSearch(term)
      
      SearchPage.verifySearchResults()
    })
  });
}); 