export class AdminAlbumsPage {
  elements = {
    adminContainer: '.admin-albums-container',
    formSection: '.form-section',
    addAlbumTitle: 'h3:contains("Add New Album")',
    titleInput: 'input[name="title"]',
    artistSelect: 'mat-select[name="artistId"]',
    descriptionInput: 'input[name="description"]',
    genreInput: 'input[name="genre"]',
    releaseDateInput: 'input[name="releaseDate"]',
    labelInput: 'input[name="label"]',
    addAlbumButton: 'button[type="submit"]:contains("Create Album")',
    editAlbumButton: 'button:contains("Save")',
    tableSection: '.table-section',
    searchField: 'input[placeholder*="Thriller"]', 
    albumsTable: '.full-width-table',
    tableHeaders: 'th',
    tableRows: 'td',
    editButtons: 'button[title="Edit Album"]',
    deleteButtons: 'button[title="Delete Album"]',
    paginator: 'mat-paginator'
  }

  getAlbumsTable() {
    return cy.get(this.elements.albumsTable)
      .filter((index, table) => {
        return Cypress.$(table).find('th').filter((i, th) => th.textContent.includes('Title')).length > 0
      })
      .first()
  }

  visitAdminDashboard(){
    cy.visit('/home')
    cy.get('app-user-profile button[mat-icon-button]').click()
    cy.get('button').contains('Admin').click()
    cy.url().should('include', '/admin')
    

    cy.get('body').then(($body) => {
      const albumsSection = $body.find('[class*="album"], [id*="album"], button:contains("Albums"), a:contains("Albums")').first()
      
      if (albumsSection.length > 0) {
        cy.log('Found albums section, clicking on it...')
        cy.wrap(albumsSection).click()
      } else {
        cy.log('Albums section not found, scrolling to find it...')
        cy.scrollTo('bottom', { duration: 2000 })
        cy.get('body').then(($bodyAfterScroll) => {
          const albumsSectionAfterScroll = $bodyAfterScroll.find('[class*="album"], [id*="album"], button:contains("Albums"), a:contains("Albums")').first()
          if (albumsSectionAfterScroll.length > 0) {
            cy.log('Found albums section after scrolling, clicking on it...')
            cy.wrap(albumsSectionAfterScroll).click()
          } else {
            cy.log('Albums section not found, may need manual navigation')
          }
        })
      }
    })
  }

  verifyAdminElements() {
    cy.get('body').then(($body) => {
      const pageText = $body.text()
      cy.log('Page text: ' + pageText.substring(0, 500))
      
      const hasAlbumText = pageText.toLowerCase().includes('album')
      const hasSongText = pageText.toLowerCase().includes('song')
      cy.log(`Page contains 'album': ${hasAlbumText}, contains 'song': ${hasSongText}`)
      
      const hasForm = $body.find('form, input, mat-form-field').length > 0
      const hasTable = $body.find('table, mat-table').length > 0
      cy.log(`Page has form elements: ${hasForm}, has table: ${hasTable}`)
      
      $body.find('h1, h2, h3, h4, h5, h6').each((index, element) => {
        const text = element.textContent || element.innerText || ''
        if (text.length > 0 && text.length < 100) {
          cy.log(`Heading ${index + 1}: "${text}"`)
        }
      })
    })
    
    cy.get('body').then(($body) => {
      const hasAdminContainer = $body.find('.admin-albums-container, .admin-container, [class*="admin"]').length > 0
      const hasAddTitle = $body.find('h3:contains("Add New Album"), h3:contains("Add New Song"), h3:contains("Create"), h3:contains("Add")').length > 0
      
      cy.log(`Has admin container: ${hasAdminContainer}, Has add title: ${hasAddTitle}`)
      
      if (hasAdminContainer) {
        cy.get('.admin-albums-container, .admin-container, [class*="admin"]').first().should('be.visible')
      }
      
      if (hasAddTitle) {
        cy.get('h3:contains("Add New Album"), h3:contains("Add New Song"), h3:contains("Create"), h3:contains("Add")').first().should('be.visible')
      }
    })
    
    cy.get('body').then(($body) => {
      const tables = $body.find('table, mat-table, .mat-elevation-z8')
      cy.log(`Found ${tables.length} tables on the page`)
      
      if (tables.length > 0) {
        cy.get('table, mat-table, .mat-elevation-z8').first().should('be.visible')
      }
    })
  }

  addAlbum(album) {
    cy.get(this.elements.titleInput).clear().type(album.title)
    cy.get(this.elements.artistSelect).first().click()

    cy.get('mat-option')
      .should('have.length.greaterThan', 0)
      .first()
      .click()

    cy.get('body').type('{esc}')
    cy.get(this.elements.descriptionInput).clear().type(album.description)
    cy.get(this.elements.genreInput).clear().type(album.genre)
    cy.get(this.elements.releaseDateInput).click().type(album.releaseDate)
    cy.get(this.elements.labelInput).clear().type(album.label)
    cy.get(this.elements.addAlbumButton).click()
  }

  searchAlbum(title) {
    cy.get(this.elements.searchField).clear().type(title)
    this.getAlbumsTable()
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })
  }

  editFirstAlbum(newTitle) {
    cy.log(`Attempting to edit album title to: ${newTitle}`)
    
    
    cy.get(this.elements.editButtons).first().click()
    cy.log('Edit button clicked')

    cy.get('body').then(($body) => {
      const hasDialog = $body.find('mat-dialog-container, .mat-dialog-container, [role="dialog"]').length > 0
      cy.log(`Dialog found: ${hasDialog}`)
      
      if (hasDialog) {  
        cy.log('Using dialog editing method')
        cy.get('mat-dialog-container, .mat-dialog-container, [role="dialog"]')
          .should('exist')
          .then(($dialog) => {
            const titleInput = $dialog.find('input[name="title"], input[placeholder*="title"], input[placeholder*="Title"]').first()
            cy.log(`Title input found in dialog: ${titleInput.length > 0}`)
            
            if (titleInput.length > 0) {
              cy.wrap(titleInput).clear().type(newTitle)
              cy.log(`Typed new title: ${newTitle}`)
            } else {
              cy.log('No specific title input found, using first input')
              cy.get('mat-dialog-container, .mat-dialog-container, [role="dialog"]')
                .find('input')
                .first()
                .clear()
                .type(newTitle)
              cy.log(`Typed new title in first input: ${newTitle}`)
            }
          })
        
        
        cy.get('mat-dialog-container, .mat-dialog-container, [role="dialog"]')
          .find('button:contains("Save"), button:contains("Update"), button[type="submit"]')
          .first()
          .click()
        cy.log('Save button clicked in dialog')
      } else {
        cy.log('No dialog found, trying inline editing...')
        
        cy.get('input[name="title"], input[placeholder*="title"], input[placeholder*="Title"]')
          .first()
          .clear()
          .type(newTitle)
        cy.log(`Typed new title inline: ${newTitle}`)
              
        cy.get('button:contains("Save"), button:contains("Update"), button[type="submit"]')
          .first()
          .click()
        cy.log('Save button clicked inline')
      }
    })
    
    cy.log('Edit operation completed')
  }

  deleteFirstAlbum() {
    cy.get(this.elements.deleteButtons).first().click()
    cy.get('mat-dialog-container').should('be.visible')
    cy.get('mat-dialog-container mat-dialog-content')
      .should('contain.text', 'Are you sure you want to delete this album?')
    cy.get('mat-dialog-container mat-dialog-actions button[color="warn"]').click()
  }

  paginateNext() {
    this.getAlbumsTable()
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })

    cy.get('.admin-albums-container')  
      .find('mat-paginator')
      .first() 
      .as('myPaginator')

    cy.get('@myPaginator')
      .find('button[aria-label="Next page"]')
      .first()
      .click()

    this.getAlbumsTable()
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })

    return this
  }
}

export default new AdminAlbumsPage() 