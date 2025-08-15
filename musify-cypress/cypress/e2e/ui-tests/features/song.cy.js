import SongPage from '../../pages/SongPage.js'
import { login } from '../../utils/loginUtils.js'

describe('Songs - Test for songs', () => {
  let users
  let songs

  before(() => {
    cy.fixture('users').then(userData => {
      users = userData
      cy.fixture('songs').then(songData => {
        songs = songData

        const email = users.adminUser5.email
        const password = users.adminUser5.password

        login(email, password)
      })
    })
  })

  it('should access first trending song from home and see song profile', () => {
    cy.visitHomeAndClickFirstTrendingSong();
    cy.verifySongDetailPageVisible();
    cy.verifySongTitleNotEmpty();
  });

  it('should play the song', () => {
    cy.visitHomeAndClickFirstTrendingSong();
    cy.playSong();
  });

  it('should add song to a playlist if available', () => {
    cy.visitHomeAndClickFirstTrendingSong();
    cy.selectFirstPlaylist();
  });

  it('should open first artist profile from song profile', () => {
    cy.visitHomeAndClickFirstTrendingSong();
    cy.clickFirstArtist();
    cy.url().should('include', '/artist'); 
  });

  it('should open the more options menu', () => {
  cy.visitHomeAndClickFirstTrendingSong();
  cy.clickOptionMenu();
  });
})
