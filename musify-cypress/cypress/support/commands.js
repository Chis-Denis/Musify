import LoginPage from '../e2e/pages/LoginPage.js'
import ProfilePage from '../e2e/pages/ProfilePage.js'
import AdminPage from '../e2e/pages/AdminPage.js'
import AlbumsPage from '../e2e/pages/AlbumsPage.js'
import RegisterPage from '../e2e/pages/RegisterPage.js'

import HomePage from '../e2e/pages/HomePage.js'
import SearchPage from '../e2e/pages/SearchPage.js'
import ChangePasswordPage from '../e2e/pages/ChangePasswordPage.js'
import LogoutPage from '../e2e/pages/LogoutPage.js'
import AdminSongsPage  from '../e2e/pages/AdminSongPage.js'
import AdminAlbumsPage from '../e2e/pages/AdminAlbumsPage.js'
import ForgotPasswordPage from '../e2e/pages/ForgotPasswordPage.js'
import ResetPasswordPage from '../e2e/pages/ResetPasswordPage.js'
import SongPage  from '../e2e/pages/SongPage.js'


Cypress.Commands.add('visitProfile', () => {
  ProfilePage.visit()
})

Cypress.Commands.add('verifyProfile', () => {
  ProfilePage.verifyProfileElements()
  ProfilePage.verifyUserInfo()
})

Cypress.Commands.add('visitAdmin', () => {
  AdminPage.visit()
})

Cypress.Commands.add('verifyAdmin', () => {
  AdminPage.verifyAdminElements()
})

Cypress.Commands.add('visitChangePassword', () => {
  ChangePasswordPage.visit()
})

Cypress.Commands.add('verifyChangePassword', () => {
  ChangePasswordPage.verifyChangePasswordPage()
})

Cypress.Commands.add('performSearch', (searchTerm) => {
  SearchPage.performSearch(searchTerm)
})

Cypress.Commands.add('verifySearchResults', () => {
  SearchPage.verifySearchResults()
})

Cypress.Commands.add('getLoginPage', () => {
  return LoginPage
})

Cypress.Commands.add('getProfilePage', () => {
  return ProfilePage
})

Cypress.Commands.add('getAdminPage', () => {
  return AdminPage
})

Cypress.Commands.add('visitAlbums', () => {
  AlbumsPage.visit()
})

Cypress.Commands.add('verifyAlbums', () => {
  AlbumsPage.verifyAlbumsPageLoaded()
  AlbumsPage.verifyAlbumCardsExist()
})

Cypress.Commands.add('getAlbumsPage', () => {
  return AlbumsPage
})

Cypress.Commands.add('visitRegister', () => {
  RegisterPage.visit()
})

Cypress.Commands.add('verifyRegisterPage', () => {
  RegisterPage.verifyPageLoaded()
})

Cypress.Commands.add('fillRegisterForm', (userData) => {
  RegisterPage.fillRegistrationForm(userData)
})

Cypress.Commands.add('verifyRequiredFieldValidation', (userData) => {
  RegisterPage.verifyRequiredFieldValidation(userData)
})

Cypress.Commands.add('submitRegisterForm', () => {
  RegisterPage.submitForm()
})

Cypress.Commands.add('clearRegisterForm', () => {
  RegisterPage.clearForm()
})

Cypress.Commands.add('verifyRegisterButtonState', (shouldBeDisabled) => {
  if (shouldBeDisabled) {
    RegisterPage.verifyRegisterButtonDisabled()
  } else {
    RegisterPage.verifyRegisterButtonEnabled()
  }
})

Cypress.Commands.add('verifyRegisterError', (message) => {
  RegisterPage.verifyErrorMessage(message)
})

Cypress.Commands.add('verifyNoRegisterError', () => {
  RegisterPage.verifyNoErrorMessage()
})

Cypress.Commands.add('verifyAnyRegisterError', () => {
  RegisterPage.verifyAnyErrorMessage()
})

Cypress.Commands.add('verifyRegisterToast', (message) => {
  RegisterPage.verifyToastNotification(message)
})

Cypress.Commands.add('verifyAnyRegisterToast', () => {
  RegisterPage.verifyAnyToastNotification()
})

Cypress.Commands.add('dismissRegisterToast', () => {
  RegisterPage.dismissToastNotification()
})

Cypress.Commands.add('testRegisterValidation', () => {
  // Get the test data from the fixture
  cy.fixture('register').then((testData) => {
    RegisterPage.verifyRequiredFieldValidation(testData.validUsers[0])
  })
})

Cypress.Commands.add('navigateToLoginFromRegister', () => {
  RegisterPage.clickLoginLink()
})

Cypress.Commands.add('getRegisterPage', () => {
  return RegisterPage
})

Cypress.Commands.add('getHomePage', () => {
  return HomePage
})

Cypress.Commands.add('getSearchPage', () => {
  return SearchPage
})

Cypress.Commands.add('getChangePasswordPage', () => {
  return ChangePasswordPage
})

Cypress.Commands.add('openProfileMenu', () => {
  HomePage.openProfileMenu()
})

Cypress.Commands.add('navigateToProfile', () => {
  HomePage.navigateToProfile()
})

Cypress.Commands.add('navigateToAdmin', () => {
  HomePage.navigateToAdmin()
})

Cypress.Commands.add('navigateToChangePassword', () => {
  HomePage.navigateToChangePassword()
})

Cypress.Commands.add('navigateToLogout', () => {
  HomePage.navigateToLogout()
})

Cypress.Commands.add('verifyProfileMenuElements', () => {
  HomePage.verifyProfileMenuElements()
})

Cypress.Commands.add('verifyProfilePage', () => {
  ProfilePage.verifyProfilePage()
})

Cypress.Commands.add('verifyAdminPage', () => {
  AdminPage.verifyAdminElements()
})

Cypress.Commands.add('verifyChangePasswordPage', () => {
  ChangePasswordPage.verifyChangePasswordPage()
})

Cypress.Commands.add('verifyLogout', () => {
  LogoutPage.verifyLogoutSuccess()
})

Cypress.Commands.add('verifyLogoutWithFallback', () => {
  LogoutPage.verifyLogoutSuccessWithFallback()
})

Cypress.Commands.add('verifyLogoutElements', () => {
  LogoutPage.verifyLoginPageElements()
})

Cypress.Commands.add('verifyLogoutAuthentication', () => {
  LogoutPage.verifyAuthenticationCleared()
})

Cypress.Commands.add('verifyLogoutRedirect', () => {
  LogoutPage.verifyLoginPageRedirect()
})

Cypress.Commands.add('getLogoutPage', () => {
  return LogoutPage
})

Cypress.Commands.add('verifyLogoutUsingLoginPage', () => {
  LogoutPage.verifyLogoutUsingLoginPage()
})


Cypress.Commands.add('navigateToSongsInAdmin', () =>{
  AdminSongsPage.visitAdminDashboard()
})

Cypress.Commands.add('verifyAdminSongsElements', () => {
  AdminSongsPage.verifyAdminElements()
})

Cypress.Commands.add('addSong', (song) => {
  AdminSongsPage.addSong(song)
})

Cypress.Commands.add('searchSong', (title) => {
  AdminSongsPage.searchSong(title)
})

Cypress.Commands.add('editFirstSong', (newTitle) => {
  AdminSongsPage.editFirstSong(newTitle)
})

Cypress.Commands.add('deleteFirstSong', () => {
  AdminSongsPage.deleteFirstSong()
})

Cypress.Commands.add('paginateNext', () => {
  // Target the specific paginator within the admin artists container
  cy.get('.admin-artists-container mat-paginator button[aria-label="Next page"]')
    .first() // ✅ Click only the first matching element
    .click()
  cy.wait(1000)
})

Cypress.Commands.add('getAdminSongsPage', () => {
  return AdminSongsPage
})

// Albums commands
Cypress.Commands.add('navigateToAlbumsInAdmin', () =>{
  AdminAlbumsPage.visitAdminDashboard()
})

Cypress.Commands.add('verifyAdminAlbumsElements', () => {
  AdminAlbumsPage.verifyAdminElements()
})

Cypress.Commands.add('addAlbum', (album) => {
  AdminAlbumsPage.addAlbum(album)
})

Cypress.Commands.add('searchAlbum', (title) => {
  AdminAlbumsPage.searchAlbum(title)
})

Cypress.Commands.add('editFirstAlbum', (newTitle) => {
  AdminAlbumsPage.editFirstAlbum(newTitle)
})

Cypress.Commands.add('deleteFirstAlbum', () => {
  AdminAlbumsPage.deleteFirstAlbum()
})

Cypress.Commands.add('paginateNextAlbums', () => {
  cy.get('mat-paginator').first().within(() => {
    cy.get('button[aria-label="Next page"]').then($btn => {
      if (!$btn.prop('disabled')) {
        cy.wrap($btn).click()
      } else {
        cy.log('Next page button is disabled, not clicking.')
      }
    })
  })
})

Cypress.Commands.add('getAdminAlbumsPage', () => {
  return AdminAlbumsPage
})

Cypress.Commands.add('visitForgotPassword', () => {
  ForgotPasswordPage.visit()
})

Cypress.Commands.add('verifyForgotPasswordPage', () => {
  ForgotPasswordPage.verifyPageLoaded()
})

Cypress.Commands.add('submitForgotPasswordForm', (email) => {
  ForgotPasswordPage.submitForgotPasswordForm(email)
})

Cypress.Commands.add('getForgotPasswordPage', () => {
  return ForgotPasswordPage
})

Cypress.Commands.add('visitResetPassword', (token) => {
  ResetPasswordPage.visit(token)
})

Cypress.Commands.add('verifyResetPasswordPage', () => {
  ResetPasswordPage.verifyPageLoaded()
})

Cypress.Commands.add('submitResetPasswordForm', (token, newPassword, confirmPassword) => {
  ResetPasswordPage.submitResetPasswordForm(token, newPassword, confirmPassword)
})

Cypress.Commands.add('getResetPasswordPage', () => {
  return ResetPasswordPage
})

Cypress.Commands.add('navigateToArtistsInAdmin', () => {
  cy.visit('/admin')
  cy.wait(2000)
})

Cypress.Commands.add('searchArtist', (name) => {
  cy.get('.name-filter input').should('be.visible').clear().type(name)
  cy.wait(1000)
})

Cypress.Commands.add('addPersonArtist', (artist) => {
  cy.get('.admin-artists-container').should('be.visible')
  
  cy.get('.admin-artists-container').within(() => {
    cy.contains('h3', 'Add New Artist').parent().within(() => {
      cy.get('mat-select').first().click()
    })
  })
  
  cy.get('.mat-mdc-select-panel').should('be.visible')
  cy.get('mat-option[value="person"]').should('be.visible').click()
  
  cy.wait(5000)
  
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
})

Cypress.Commands.add('addBandArtist', (artist) => {
  cy.get('.admin-artists-container').should('be.visible')
  
  cy.get('.admin-artists-container').within(() => {
    cy.contains('h3', 'Add New Artist').parent().within(() => {
      cy.get('mat-select').first().click()
    })
  })
  
  cy.get('.mat-mdc-select-panel').should('be.visible')
  cy.get('mat-option[value="band"]').should('be.visible').click()
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
})

Cypress.Commands.add('editFirstArtist', (updatedArtist) => {
  cy.get('table[mat-table]').within(() => {
    cy.get('button:has(mat-icon:contains("edit"))').should('exist').first().click()
  })
  
  cy.get('body').then(($body) => {
    if ($body.find('mat-dialog-container').length > 0) {
      cy.get('mat-dialog-container').should('be.visible').within(() => {
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
      cy.get('.mat-mdc-dialog-container').should('be.visible').within(() => {   
        cy.get('input').then(($inputs) => {
          cy.log(`Found ${$inputs.length} input fields in alternative dialog`)
          
          if (updatedArtist.stageName && $inputs.length > 0) {
            cy.wrap($inputs[0]).clear().type(updatedArtist.stageName)
          }
          if (updatedArtist.firstName && $inputs.length > 1) {
            cy.wrap($inputs[1]).clear().type(updatedArtist.firstName)
          }
        })
        
        cy.get('button:contains("Save"), button:contains("Update")').click()
      })
    } else {
      cy.log('⚠️ No edit dialog found')
      throw new Error('Edit dialog not found')
    }
  })
})

Cypress.Commands.add('deleteFirstArtist', () => {
  cy.get('table[mat-table]').within(() => {
    cy.get('button:has(mat-icon:contains("delete"))').should('exist').first().click()
  })
  
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
      cy.get('.mat-mdc-dialog-container').should('be.visible').within(() => {
        cy.get('button').then(($buttons) => {
          cy.log(`Found ${$buttons.length} buttons in alternative dialog`)
          cy.wrap($buttons.last()).click()
        })
      })
    } else {
      cy.log('⚠️ No confirmation dialog found')
      throw new Error('Delete confirmation dialog not found')
    }
  })
})

Cypress.Commands.add('paginateNext', () => {
  // Target the specific paginator within the admin artists container
  cy.get('.admin-artists-container mat-paginator button[aria-label="Next page"]')
    .first() // ✅ Click only the first matching element
    .click()
})
Cypress.Commands.add('loginAPI', (userKey) => {
  cy.fixture('users').then((users) => {
    const user = users[userKey]
    
    if (!user) {
      throw new Error(`User "${userKey}" not found in users.json`)
    }

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/Auth/login`,
      body: {
        email: user.email,
        password: user.password
      },
      failOnStatusCode: false 
    }).then((response) => {
      expect(response.status).to.eq(200)
      cy.wrap(response.body.token).as('authToken')
    })
  })
})





Cypress.Commands.add('visitHomeAndClickFirstTrendingSong', () => {
  SongPage.visitHome();
  SongPage.clickFirstTrendingSong();
});

Cypress.Commands.add('verifySongDetailPageVisible', () => {
  SongPage.elements.songDetailPage().should('be.visible');
});

Cypress.Commands.add('verifySongTitleNotEmpty', () => {
  SongPage.elements.songTitle().should('exist').and('not.be.empty');
});

Cypress.Commands.add('playSong', () => {
  SongPage.playSong();
});

Cypress.Commands.add('togglePlaylistDropdown', () => {
  SongPage.togglePlaylistDropdown();
});

Cypress.Commands.add('verifyPlaylistDropdownVisible', () => {
  SongPage.elements.playlistDropdown().should('be.visible');
});

Cypress.Commands.add('selectFirstPlaylist', () => {
  SongPage.selectFirstPlaylist();
});

Cypress.Commands.add('addToPlaylist', () => {
  SongPage.addToPlaylist();
});

Cypress.Commands.add('clickFirstArtist', () => {
  SongPage.clickFirstArtist();
});

Cypress.Commands.add('clickOptionMenu', () => {
  SongPage.clickOptionMenu();
});

Cypress.Commands.add('navigateToUsersInAdmin', () => {
  cy.visit('/home')
  cy.wait(500)
  cy.visit('/admin')
  
  cy.contains(/^users$/i).click()
})

Cypress.Commands.add('searchUser', (email) => {
  cy.get('input[placeholder="Type email..."]').clear().type(email)
})

Cypress.Commands.add('paginateNext', () => {
  cy.get('mat-card:has(table)')
    .find('button[aria-label="Next page"]')
    .first()
    .click()
})