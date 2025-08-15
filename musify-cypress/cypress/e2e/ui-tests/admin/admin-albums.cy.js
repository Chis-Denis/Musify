import AdminAlbumsPage from '../../pages/AdminAlbumsPage.js'
import { login } from '../../utils/loginUtils.js'

describe('Admin Albums - Test for albums', () => {
  let users
  let albums

  before(() => {
    cy.fixture('users').then(userData => {
      users = userData
      cy.fixture('albums').then(albumData => {
        albums = albumData

        const email = users.adminUser6.email
        const password = users.adminUser6.password

        login(email, password)
        cy.navigateToAlbumsInAdmin()
      })
    })
  })

  it('should display admin albums page', () => {
    AdminAlbumsPage.verifyAdminElements()
  })

  it('should search albums by title', () => {
    cy.searchAlbum(albums.searchTerms.title)
  })

  it('should paginate through the table', () => {
    cy.paginateNextAlbums()
  })

  it('should add a new album', () => {
    cy.addAlbum(albums.newAlbum)
    AdminAlbumsPage.searchAlbum(albums.newAlbum.title)
    AdminAlbumsPage.getAlbumsTable().should('contain.text', albums.newAlbum.title)
  })

  it('should edit the new album', () => {
    AdminAlbumsPage.searchAlbum(albums.newAlbum.title)
    
    cy.get('table').then(($table) => {
      cy.log('Table content before edit: ' + $table.text())
    })
    
    cy.editFirstAlbum(albums.updatedAlbum.title)
    
    cy.wait(2000)
    
    AdminAlbumsPage.searchAlbum(albums.updatedAlbum.title)
    
    cy.get('table').then(($table) => {
      cy.log('Table content after edit: ' + $table.text())
    })
    
    AdminAlbumsPage.getAlbumsTable().should('contain.text', albums.updatedAlbum.title)
  })

  it('should delete the new album', () => {
    AdminAlbumsPage.searchAlbum(albums.updatedAlbum.title)
    cy.deleteFirstAlbum()
    
    AdminAlbumsPage.getAlbumsTable().should('not.contain.text', albums.updatedAlbum.title)
  })
}) 
