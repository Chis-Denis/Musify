import AdminSongsPage from '../../pages/AdminSongPage'
import { login } from '../../utils/loginUtils.js'

describe('Admin Songs - Test for songs', () => {
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
        cy.navigateToSongsInAdmin()
      })
    })
  })

   it('should display admin songs page', () => {
    AdminSongsPage.verifyAdminElements()
  })

  it('should search songs by title', () => {
    cy.searchSong(songs.searchSong.title)
  })

  it('should paginate through the table', () => {
    cy.paginateNext()
  })

  it('should add a new song', () => {
    cy.addSong(songs.newSong)
    AdminSongsPage.searchSong(songs.newSong.title)
    AdminSongsPage.getSongsTable().should('contain.text', songs.newSong.title)
  })

  it('should edit the new song', () => {
    AdminSongsPage.searchSong(songs.newSong.title)
    cy.editFirstSong(songs.updateSong.title)
    AdminSongsPage.getSongsTable().should('contain.text', songs.updateSong.title)
  })

  it('should delete the new song', () => {
    AdminSongsPage.searchSong(songs.updateSong.title)
    cy.deleteFirstSong()
  })

})
