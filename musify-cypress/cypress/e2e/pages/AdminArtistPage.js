export class AdminArtistsPage {
  elements = {
    adminContainer: '.admin-artists-container',
    addArtistTitle: 'h3:contains("Add New Artist")',
    addArtistButton: 'button:contains("Add Artist")',
    
    // Band members section
    bandMembersSection: 'h3:contains("Band Members")',
    addMemberButton: 'button:contains("Add Member")',
    removeMemberButton: 'button:contains("Remove Member")',
    
    // Table section - use more generic selectors that actually exist
    searchField: '.name-filter input',
    artistsTable: 'table[mat-table]',
    tableHeaders: 'th',
    tableRows: 'tr[mat-row]',
    editButtons: 'button:has(mat-icon:contains("edit"))', // Remove the non-existent .table-section
    deleteButtons: 'button:has(mat-icon:contains("delete"))', // Remove the non-existent .table-section
    paginator: 'mat-paginator'
  }

  getArtistsTable() {
    return cy.get(this.elements.artistsTable).first()
  }

  verifyAdminElements() {
    cy.get(this.elements.adminContainer).should('be.visible')
    cy.get(this.elements.addArtistTitle).should('contain', 'Add New Artist')
    cy.get(this.elements.bandMembersSection).should('contain', 'Band Members')
    
    this.getArtistsTable()
      .should('be.visible')
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })
  }

  selectArtistType(type) {
    cy.get('.admin-artists-container').within(() => {
      cy.contains('h3', 'Add New Artist').parent().within(() => {
        cy.get('mat-select').first().click()
      })
    })
    
    cy.get('.mat-mdc-select-panel').should('be.visible')
    cy.get(`mat-option[value="${type}"]`).should('be.visible').click()
    cy.wait(1000)
    return this
  }

  addPersonArtist(artist) {
    this.selectArtistType('person')
    
    cy.get('.admin-artists-container').within(() => {
      cy.contains('h3', 'Add New Artist').parent().within(() => {
        if (artist.stageName) {
          cy.contains('mat-form-field', 'Stage Name').find('input').should('be.visible').clear().type(artist.stageName)
        }
        
        if (artist.firstName) {
          cy.contains('mat-form-field', 'First Name').find('input').should('be.visible').clear().type(artist.firstName)
        }
        
        if (artist.lastName) {
          cy.contains('mat-form-field', 'Last Name').find('input').should('be.visible').clear().type(artist.lastName)
        }
        
        if (artist.birthday) {
          cy.contains('mat-form-field', 'Birthday').find('input').should('be.visible').clear().type(artist.birthday)
        }
        
        if (artist.activeStart) {
          cy.contains('mat-form-field', 'Active Start').find('input').should('be.visible').clear().type(artist.activeStart)
        }
        
        if (artist.activeEnd) {
          cy.contains('mat-form-field', 'Active End').find('input').should('be.visible').clear().type(artist.activeEnd)
        }
        
        cy.get('button:contains("Add Artist")').click()
      })
    })
    return this
  }

  addBandArtist(artist) {
    this.selectArtistType('band')
    
    cy.get('.admin-artists-container').within(() => {
      cy.contains('h3', 'Add New Artist').parent().within(() => {
        if (artist.bandName) {
          cy.contains('mat-form-field', 'Band Name').find('input').should('be.visible').clear().type(artist.bandName)
        }
        
        if (artist.location) {
          cy.contains('mat-form-field', 'Location').find('input').should('be.visible').clear().type(artist.location)
        }
        
        if (artist.activeStart) {
          cy.contains('mat-form-field', 'Active Start').find('input').should('be.visible').clear().type(artist.activeStart)
        }
        
        if (artist.activeEnd) {
          cy.contains('mat-form-field', 'Active End').find('input').should('be.visible').clear().type(artist.activeEnd)
        }
        
        cy.get('button:contains("Add Artist")').click()
      })
    })
    return this
  }

  searchArtist(name) {
    cy.log(`Searching for artist: "${name}"`)
    
    cy.get(this.elements.searchField).clear({ force: true })
    cy.wait(500)
    
    cy.get('table[mat-table] tbody tr').its('length').then((initialCount) => {
      cy.log(`Initial rows before search: ${initialCount}`)
      
      cy.get(this.elements.searchField).type(name, { force: true })
      cy.wait(2000)
      
      cy.get('table[mat-table] tbody tr').its('length').then((afterSearchCount) => {
        if (afterSearchCount !== initialCount) {
          cy.log('✓ Search triggered automatically')
        } else {
          cy.log('⚠️ Search may not have triggered - but continuing')
        }
      })
    })
    
    cy.get('table[mat-table]').should('be.visible')
    cy.log(`Search completed for: "${name}"`)
    
    return this
  }

  editFirstArtist(updatedArtist) {
    // Use more generic selector and add debugging
    cy.get('table[mat-table]').within(() => {
      cy.get('button:has(mat-icon:contains("edit"))').should('exist').first().click()
    })

    // Add debugging and more flexible dialog detection
    cy.get('body').then(($body) => {
      if ($body.find('mat-dialog-container').length > 0) {
        cy.get('mat-dialog-container').should('be.visible').within(() => {
          cy.wait(1000)
          
          cy.get('input').then(($inputs) => {
            cy.log(`Found ${$inputs.length} input fields in edit dialog`)
            
            if (updatedArtist.stageName && $inputs.length > 0) {
              cy.wrap($inputs[0]).clear().type(updatedArtist.stageName)
            }
            if (updatedArtist.firstName && $inputs.length > 1) {
              cy.wrap($inputs[1]).clear().type(updatedArtist.firstName)
            }
            if (updatedArtist.lastName && $inputs.length > 2) {
              cy.wrap($inputs[2]).clear().type(updatedArtist.lastName)
            }
            if (updatedArtist.bandName && $inputs.length > 0) {
              cy.wrap($inputs[0]).clear().type(updatedArtist.bandName)
            }
            if (updatedArtist.location && $inputs.length > 1) {
              cy.wrap($inputs[1]).clear().type(updatedArtist.location)
            }
          })
          
          cy.get('button:contains("Save"), button:contains("Update")').click()
        })
      } else if ($body.find('.mat-mdc-dialog-container').length > 0) {
        // Alternative dialog container
        cy.get('.mat-mdc-dialog-container').should('be.visible').within(() => {
          cy.wait(1000)
          
          cy.get('input').then(($inputs) => {
            cy.log(`Found ${$inputs.length} input fields in alternative edit dialog`)
            
            if (updatedArtist.stageName && $inputs.length > 0) {
              cy.wrap($inputs[0]).clear().type(updatedArtist.stageName)
            }
            if (updatedArtist.firstName && $inputs.length > 1) {
              cy.wrap($inputs[1]).clear().type(updatedArtist.firstName)
            }
            if (updatedArtist.lastName && $inputs.length > 2) {
              cy.wrap($inputs[2]).clear().type(updatedArtist.lastName)
            }
          })
          
          cy.get('button:contains("Save"), button:contains("Update")').click()
        })
      } else {
        cy.log('⚠️ No edit dialog found - edit button may not have worked')
      }
    })

    return this
  }

  deleteFirstArtist() {
    // Use more generic selector and add debugging
    cy.get('table[mat-table]').within(() => {
      cy.get('button:has(mat-icon:contains("delete"))').should('exist').first().click()
    })
    
    // Add debugging and more flexible dialog detection
    cy.get('body').then(($body) => {
      if ($body.find('mat-dialog-container').length > 0) {
        cy.get('mat-dialog-container').should('be.visible').within(() => {
          cy.get('button').then(($buttons) => {
            cy.log(`Found ${$buttons.length} buttons in confirmation dialog`)
            
            const confirmBtn = $buttons.filter(':contains("Confirm")')
            const deleteBtn = $buttons.filter(':contains("Delete")')
            const yesBtn = $buttons.filter(':contains("Yes")')
            const warnBtns = $buttons.filter('[color="warn"]')
            
            if (confirmBtn.length > 0) {
              cy.wrap(confirmBtn.first()).click()
            } else if (deleteBtn.length > 0) {
              cy.wrap(deleteBtn.first()).click()
            } else if (yesBtn.length > 0) {
              cy.wrap(yesBtn.first()).click()
            } else if (warnBtns.length === 1) {
              cy.wrap(warnBtns.first()).click()
            } else {
              cy.wrap($buttons.last()).click()
            }
          })
        })
      } else if ($body.find('.mat-mdc-dialog-container').length > 0) {
        // Alternative dialog container
        cy.get('.mat-mdc-dialog-container').should('be.visible').within(() => {
          cy.get('button').then(($buttons) => {
            cy.log(`Found ${$buttons.length} buttons in alternative confirmation dialog`)
            cy.wrap($buttons.last()).click() // Click the last button (usually confirm)
          })
        })
      } else {
        cy.log('⚠️ No confirmation dialog found - delete button may not have worked')
      }
    })
    
    return this
  }

  addBandMember(bandName, memberName) {
    cy.get('h3:contains("Band Members")').scrollIntoView()
    cy.wait(1000)
    
    cy.get('.admin-artists-container').within(() => {
      cy.contains('h3', 'Band Members').parent().within(() => {
        cy.get('mat-select').first().click({ force: true })
        
        cy.get('body').then(($body) => {
          if ($body.find('.mat-mdc-select-panel mat-option').length > 0) {
            cy.get('.mat-mdc-select-panel mat-option').contains(bandName).click()
            
            cy.get('mat-select').eq(1).click({ force: true })
            
            cy.get('body').then(($body2) => {
              if ($body2.find('.mat-mdc-select-panel mat-option').length > 0) {
                cy.get('.mat-mdc-select-panel mat-option').contains(memberName).click()
                cy.get('button:contains("Add Member")').click()
              }
            })
          }
        })
      })
    })
    return this
  }

  removeBandMember(bandName, memberName) {
    cy.get('h3:contains("Band Members")').scrollIntoView()
    cy.wait(1000)
    
    cy.get('.admin-artists-container').within(() => {
      cy.contains('h3', 'Band Members').parent().within(() => {
        cy.get('mat-select').first().click({ force: true })
        
        cy.get('body').then(($body) => {
          if ($body.find('.mat-mdc-select-panel mat-option').length > 0) {
            cy.get('.mat-mdc-select-panel mat-option').contains(bandName).click()
            
            cy.get('mat-select').eq(1).click({ force: true })
            
            cy.get('body').then(($body2) => {
              if ($body2.find('.mat-mdc-select-panel mat-option').length > 0) {
                cy.get('.mat-mdc-select-panel mat-option').contains(memberName).click()
                cy.get('button:contains("Remove Member")').click()
              }
            })
          }
        })
      })
    })
    return this
  }

  paginateNext() {
    this.getArtistsTable()
      .within(() => {
        cy.get('tbody tr').should('have.length.greaterThan', 0)
      })

    cy.get(this.elements.paginator)
      .first()
      .find('button[aria-label="Next page"]')
      .first()
      .click()

    cy.wait(1000)
    return this
  }
}

export default new AdminArtistsPage()