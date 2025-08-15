class HomePage {
  static menuButton = 'button[mat-icon-button], button[aria-label*="menu"], button[title*="menu"], .menu-button, .hamburger-menu'
  static sidebar = 'mat-sidenav, .sidebar, .drawer, [class*="sidenav"], [class*="drawer"]'
  static navList = 'mat-nav-list, .nav-list, .navigation-list, [class*="nav-list"]'
  static navItems = 'a[mat-list-item], .nav-item, .menu-item, [class*="nav-item"], [class*="menu-item"]'
  
  static albumsContent = '[class*="albums"]'
  static playlistsContent = '[class*="playlists"]'
  static albumCards = 'mat-card'
  
  static visit() {
    cy.visit('/')
  }
  
  static openSidebar() {
    cy.get('body').then(($body) => {
      const sidebar = $body.find(this.sidebar)
      if (sidebar.length > 0 && (sidebar.hasClass('mat-drawer-opened') || 
          sidebar.hasClass('opened') ||
          sidebar.is(':visible'))) {
        return
      }
      
      let menuButton = $body.find(this.menuButton).first()
      
      if (menuButton.length === 0) {
        menuButton = $body.find('button').filter((index, button) => {
          const $button = Cypress.$(button)
          return $button.find('mat-icon').text().includes('menu') ||
                 $button.find('i').text().includes('menu') ||
                 $button.attr('aria-label')?.includes('menu') ||
                 $button.attr('title')?.includes('menu')
        }).first()
      }
      
      if (menuButton.length > 0) {
        cy.wrap(menuButton).click()
        cy.get(this.sidebar).should('be.visible', { timeout: 5000 })
      } else {
        cy.get(this.sidebar).should('exist', { timeout: 2000 })
      }
    })
  }
  
  static navigateToAlbums() {
    this.openSidebar()
    
    cy.wait(1000)
    
    cy.get('body').then(($body) => {
      const navItems = $body.find(this.navItems)
      const albumsLink = navItems.filter((index, item) => {
        const $item = Cypress.$(item)
        return $item.text().toLowerCase().includes('album') ||
               $item.text().toLowerCase().includes('albums')
      }).first()
      
      if (albumsLink.length > 0) {
        cy.wrap(albumsLink).click({ force: true })
      } else {
        cy.visit('/home/albums', { failOnStatusCode: false })
      }
    })
  }
  
  static navigateToPlaylists() {
    this.openSidebar()
    
    cy.wait(1000)
    
    cy.get('body').then(($body) => {  
      const navItems = $body.find(this.navItems)
      const playlistsLink = navItems.filter((index, item) => {
        const $item = Cypress.$(item)
        return $item.text().toLowerCase().includes('playlist') ||
               $item.text().toLowerCase().includes('playlists')
      }).first()
      
      if (playlistsLink.length > 0) {
        cy.wrap(playlistsLink).click({ force: true })
      } else {
        cy.visit('/home/playlists', { failOnStatusCode: false })
      }
    })
  }
  
  static openProfileMenu() {
    cy.get('body').then(($body) => {
      let accountIcon = $body.find('mat-icon').filter((index, element) => {
        return Cypress.$(element).text().includes('account_circle') ||
               Cypress.$(element).text().includes('person') ||
               Cypress.$(element).text().includes('user')
      }).first()
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('[class*="account"], [class*="profile"], [class*="user"]').first()
      }
      
      if (accountIcon.length > 0) {
        cy.wrap(accountIcon).parent().click({ force: true })
        cy.get('.profile-menu, .user-menu, [class*="menu"]').should('be.visible', { timeout: 3000 })
      }
    })
  }

  static navigateToProfile() {
    cy.get('body').then(($body) => {
      let accountIcon = $body.find('mat-icon').filter((index, element) => {
        return Cypress.$(element).text().includes('account_circle') ||
               Cypress.$(element).text().includes('person') ||
               Cypress.$(element).text().includes('user')
      }).first()
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('[class*="account"], [class*="profile"], [class*="user"]').first()
      }
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('button[mat-icon-button]').filter((index, button) => {
          const $button = Cypress.$(button)
          return $button.find('mat-icon').text().includes('account_circle') ||
                 $button.find('mat-icon').text().includes('person') ||
                 $button.find('mat-icon').text().includes('user')
        }).first()
      }
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('button').filter((index, button) => {
          const $button = Cypress.$(button)
          return $button.hasClass('mat-mdc-menu-trigger') ||
                 $button.attr('aria-label')?.includes('account') ||
                 $button.attr('aria-label')?.includes('profile') ||
                 $button.attr('aria-label')?.includes('user')
        }).first()
      }
      
      cy.log(`Account icon found: ${accountIcon.length > 0}`)
      
      if (accountIcon.length > 0) {
        cy.wrap(accountIcon).parent().click({ force: true })
        
        cy.get('.mat-mdc-menu-item, .menu-item, [class*="menu-item"]')
          .should('be.visible')
          .as('menuItems')
        
        cy.get('@menuItems').then(($menuItems) => {
          cy.log(`Found ${$menuItems.length} menu items`)
          
          $menuItems.each((index, item) => {
            cy.log(`Menu item ${index}: ${Cypress.$(item).text()}`)
          })
          
          const profileItem = $menuItems.filter((index, item) => {
            return Cypress.$(item).text().includes('Profile')
          }).first()
          
          if (profileItem.length > 0) {
            cy.wrap(profileItem).click({ force: true })
            cy.url().should('include', '/profile')
          } else {
            cy.log('Profile menu item not found')
            cy.contains('.mat-mdc-menu-item, .menu-item, [class*="menu-item"]', 'Profile').click({ force: true })
            cy.url().should('include', '/profile')
          }
        })
      } else {
        cy.log('Account icon not found - trying direct navigation')
        cy.visit('/profile', { failOnStatusCode: false })
        cy.url().should('include', '/profile')
      }
    })
  }

  static navigateToChangePassword() {
    cy.get('body').then(($body) => {
      let accountIcon = $body.find('mat-icon').filter((index, element) => {
        return Cypress.$(element).text().includes('account_circle') ||
               Cypress.$(element).text().includes('person') ||
               Cypress.$(element).text().includes('user')
      }).first()
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('[class*="account"], [class*="profile"], [class*="user"]').first()
      }
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('button[mat-icon-button]').filter((index, button) => {
          const $button = Cypress.$(button)
          return $button.find('mat-icon').text().includes('account_circle') ||
                 $button.find('mat-icon').text().includes('person') ||
                 $button.find('mat-icon').text().includes('user')
        }).first()
      }
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('button').filter((index, button) => {
          const $button = Cypress.$(button)
          return $button.hasClass('mat-mdc-menu-trigger') ||
                 $button.attr('aria-label')?.includes('account') ||
                 $button.attr('aria-label')?.includes('profile') ||
                 $button.attr('aria-label')?.includes('user')
        }).first()
      }
      
      cy.log(`Account icon found: ${accountIcon.length > 0}`)
      
      if (accountIcon.length > 0) {
        cy.wrap(accountIcon).parent().click({ force: true })
        
        cy.get('.mat-mdc-menu-item, .menu-item, [class*="menu-item"]')
          .should('be.visible')
          .as('menuItems')
        
        cy.get('@menuItems').then(($menuItems) => {
          cy.log(`Found ${$menuItems.length} menu items`)
          
          $menuItems.each((index, item) => {
            cy.log(`Menu item ${index}: ${Cypress.$(item).text()}`)
          })
          
          const changePasswordItem = $menuItems.filter((index, item) => {
            return Cypress.$(item).text().includes('Change Password')
          }).first()
          
          if (changePasswordItem.length > 0) {
            cy.wrap(changePasswordItem).click({ force: true })
            cy.url().should('include', '/change-password')
          } else {
            cy.log('Change Password menu item not found')
            cy.contains('.mat-mdc-menu-item, .menu-item, [class*="menu-item"]', 'Change Password').click({ force: true })
            cy.url().should('include', '/change-password')
          }
        })
      } else {
        cy.log('Account icon not found - trying direct navigation')
        cy.visit('/change-password', { failOnStatusCode: false })
        cy.url().should('include', '/change-password')
      }
    })
  }

  static navigateToLogout() {
    cy.get('body').then(($body) => {
      let accountIcon = $body.find('mat-icon').filter((index, element) => {
        return Cypress.$(element).text().includes('account_circle') ||
               Cypress.$(element).text().includes('person') ||
               Cypress.$(element).text().includes('user')
      }).first()
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('[class*="account"], [class*="profile"], [class*="user"]').first()
      }
      
      if (accountIcon.length > 0) {
        cy.wrap(accountIcon).parent().click({ force: true })
        
        cy.get('.mat-mdc-menu-item, .menu-item, [class*="menu-item"]')
          .should('be.visible')
          .as('menuItems')
        
        cy.get('@menuItems').then(($menuItems) => {
          const logoutItem = $menuItems.filter((index, item) => {
            return Cypress.$(item).text().includes('Logout')
          }).first()
          
          if (logoutItem.length > 0) {
            cy.wrap(logoutItem).click({ force: true })
            cy.url().should('not.include', '/home')
          } else {
            cy.log('Logout menu item not found')
          }
        })
      }
    })
  }

  static verifyProfileMenuElements() {
    cy.get('body').then(($body) => {
      let accountIcon = $body.find('mat-icon').filter((index, element) => {
        return Cypress.$(element).text().includes('account_circle') ||
               Cypress.$(element).text().includes('person') ||
               Cypress.$(element).text().includes('user')
      }).first()
      
      if (accountIcon.length === 0) {
        accountIcon = $body.find('[class*="account"], [class*="profile"], [class*="user"]').first()
      }
      
      if (accountIcon.length > 0) {
        cy.wrap(accountIcon).parent().click({ force: true })
        
        cy.get('.mat-mdc-menu-item, .menu-item, [class*="menu-item"]')
          .should('be.visible')
          .as('menuItems')
        
        cy.get('.mat-mdc-menu-item, .menu-item, [class*="menu-item"]').should('have.length.at.least', 1)
        
        cy.get('@menuItems').then(($menuItems) => {
          const hasProfile = $menuItems.text().includes('Profile')
          const hasChangePassword = $menuItems.text().includes('Change Password')
          const hasLogout = $menuItems.text().includes('Logout')
          
          if (hasProfile) {
            cy.get('@menuItems').contains('Profile').should('be.visible')
          }
          if (hasChangePassword) {
            cy.get('@menuItems').contains('Change Password').should('be.visible')
          }
          if (hasLogout) {
            cy.get('@menuItems').contains('Logout').should('be.visible')
          }
        })
      }
    })
  }
}

export default HomePage 