import ArtistProfilePage from '../../pages/ArtistProfilePage.js'
import { login } from '../../utils/loginUtils.js'
describe('Artist Profile Page', () => {
  let users
  before(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData
      const email = users.adminUser16.email
      const password = users.adminUser16.password
      login(email, password)
    })
  })
  it('should display artist profile with all sections', () => {
    ArtistProfilePage
      .visit(2) 
      .waitForLoad()
      .isArtistProfilePage()
      .verifyHeaderElements()
      .verifyArtistInfo()
      .verifyAllSections()
  })
  it('should show loading state initially', () => {
    cy.intercept('GET', '**/artists/2', (req) => {
      req.reply((res) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(res), 2000)
        })
      })
    }).as('getArtist')
    ArtistProfilePage.visit(2)
    ArtistProfilePage.verifyLoadingState()
    cy.wait('@getArtist')
    ArtistProfilePage.waitForLoad().isArtistProfilePage()
  })
  
  it('should navigate to member profile when clicking member card', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    cy.get('body').then(($body) => {
      if ($body.find('.artist-section:contains("Members")').length > 0) {
        ArtistProfilePage.verifyMembersSection()
        ArtistProfilePage.getMemberCards().then(($cards) => {
          if ($cards.length > 0) {
            ArtistProfilePage.clickMember(0)
            cy.url().should('include', '/home/artists/')
          } else {
            cy.log('Members section exists but no member cards found')
          }
        })
      } else {
        cy.log('No members section found for this artist - this is expected for solo artists')
      }
    })
  })
  it('should navigate to band profile when clicking band card', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    cy.get('body').then(($body) => {
      if ($body.find('.artist-section:contains("Bands")').length > 0) {
        ArtistProfilePage.verifyBandsSection()
        ArtistProfilePage.getBandCards().then(($cards) => {
          if ($cards.length > 0) {
            ArtistProfilePage.clickBand(0)
            cy.url().should('include', '/home/artists/')
          } else {
            cy.log('Bands section exists but no band cards found')
          }
        })
      } else {
        cy.log('No bands section found for this artist')
      }
    })
  })
  it('should navigate to album detail when clicking album card', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    cy.get('body').then(($body) => {
      if ($body.find('.artist-section:contains("Albums")').length > 0) {
        ArtistProfilePage.verifyAlbumsSection()
        ArtistProfilePage.getAlbumCards().then(($cards) => {
          if ($cards.length > 0) {
            ArtistProfilePage.clickAlbum(0)
            cy.url().should('include', '/home/') 
          } else {
            cy.log('Albums section exists but no album cards found')
          }
        })
      } else {
        cy.log('No albums found for this artist')
      }
    })
  })
  it('should navigate to song detail when clicking song card', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    cy.get('body').then(($body) => {
      if ($body.find('.artist-section:contains("Songs")').length > 0) {
        ArtistProfilePage.verifySongsSection()
        ArtistProfilePage.getSongCards().then(($cards) => {
          if ($cards.length > 0) {
            ArtistProfilePage.clickSong(0)
            cy.url().should('include', '/home/') 
          } else {
            cy.log('Songs section exists but no song cards found')
          }
        })
      } else {
        cy.log('No songs found for this artist')
      }
    })
  })
  it('should display correct artist information', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    ArtistProfilePage.getArtistName()
      .should('be.visible')
      .and('not.be.empty')
    cy.get('body').then(($body) => {
      if ($body.find('p:contains("place")').length > 0) {
        ArtistProfilePage.getLocationInfo().should('be.visible')
      } else {
        cy.log('Location information not available for this artist')
      }
      if ($body.find('p:contains("schedule")').length > 0) {
        ArtistProfilePage.getActiveTimeInfo().should('be.visible')
      } else {
        cy.log('Active time information not available for this artist')
      }
      if ($body.find('p:contains("cake")').length > 0) {
        ArtistProfilePage.getBirthdayInfo().should('be.visible')
      } else {
        cy.log('Birthday information not available for this artist')
      }
    })
  })
  it('should display correct artist type icon', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    ArtistProfilePage.getArtistIcon().should('be.visible')
    cy.get('body').then(($body) => {
      if ($body.find('.artist-section:contains("Members")').length > 0) {
        ArtistProfilePage.getArtistIcon().should('contain.text', '👥')
      } else {
        ArtistProfilePage.getArtistIcon().should('contain.text', '👤')
      }
    })
  })
  it('should have responsive card layout', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    cy.get('.card-grid').should('exist')
    cy.get('.card-grid').then(($grids) => {
      if ($grids.length > 0) {
        ArtistProfilePage.verifyResponsiveLayout()
      }
    })
  })
  it('should display hover effects on cards', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    const cardTypes = [
      { type: 'member', selector: '.artist-section:contains("Members") .mini-card' },
      { type: 'band', selector: '.artist-section:contains("Bands") .mini-card' },
      { type: 'album', selector: '.artist-section:contains("Albums") .mini-card' },
      { type: 'song', selector: '.artist-section:contains("Songs") .mini-card' }
    ]
    cardTypes.forEach(({ type, selector }) => {
      cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().trigger('mouseover')
          cy.log(`Hover effect tested for ${type} cards`)
        }
      })
    })
  })
  it('should count items in each section correctly', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    const sections = [
      { name: 'Members', countMethod: 'getMembersCount' },
      { name: 'Bands', countMethod: 'getBandsCount' },
      { name: 'Albums', countMethod: 'getAlbumsCount' },
      { name: 'Songs', countMethod: 'getSongsCount' }
    ]
    sections.forEach(({ name, countMethod }) => {
      cy.get('body').then(($body) => {
        if ($body.find(`.artist-section:contains("${name}")`).length > 0) {
          ArtistProfilePage[countMethod]().should('be.gte', 1)
          cy.log(`${name} section has items`)
        } else {
          cy.log(`${name} section not present`)
        }
      })
    })
  })
  it('should verify all sections have proper icons', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    const sectionIcons = [
      { section: 'Members', icon: 'group' },
      { section: 'Bands', icon: 'group' },
      { section: 'Albums', icon: 'album' },
      { section: 'Songs', icon: 'music_note' }
    ]
    sectionIcons.forEach(({ section, icon }) => {
      cy.get('body').then(($body) => {
        if ($body.find(`.artist-section:contains("${section}")`).length > 0) {
          cy.get(`.artist-section:contains("${section}") mat-icon`)
            .should('contain.text', icon)
          cy.log(`${section} section has correct ${icon} icon`)
        }
      })
    })
  })
  it('should handle artist not found gracefully', () => {
    ArtistProfilePage.visit(99999)
    cy.url().should('include', '/home/artists/99999')
  })
  it('should verify artist caption is displayed', () => {
    ArtistProfilePage
      .visit(2)
      .waitForLoad()
    cy.get('.mat-caption').should('contain.text', 'Artist')
  })
  context('Responsive Design Tests', () => {
    const viewports = [
      { device: 'mobile', width: 375, height: 667 },
      { device: 'tablet', width: 768, height: 1024 },
      { device: 'desktop', width: 1920, height: 1080 }
    ]
    viewports.forEach(viewport => {
      it(`should display correctly on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height)
        ArtistProfilePage
          .visit(2)
          .waitForLoad()
          .isArtistProfilePage()
          .verifyHeaderElements()
        cy.get('.mini-card').should('be.visible')
      })
    })
  })
  context('Multiple Artists Tests', () => {
    const artistIds = [2, 3] 
    artistIds.forEach(artistId => {
      it(`should load artist profile for artist ID ${artistId}`, () => {
        ArtistProfilePage
          .visit(artistId)
          .waitForLoad()
          .isArtistProfilePage()
          .verifyHeaderElements()
        ArtistProfilePage.getArtistName()
          .should('be.visible')
          .and('not.be.empty')
      })
    })
  })
  context('Conditional Content Tests', () => {
    it('should show different content for band vs solo artist', () => {
      ArtistProfilePage
        .visit(40)
        .waitForLoad()
      cy.get('body').then(($body) => {
        if ($body.find('.artist-section:contains("Members")').length > 0) {
          ArtistProfilePage.getArtistIcon().should('contain.text', '👥')
          ArtistProfilePage.verifyMembersSection()
          cy.log('Verified band artist profile')
        } else {
          ArtistProfilePage.getArtistIcon().should('contain.text', '👤')
          cy.log('Verified solo artist profile')
        }
      })
    })
    it('should display name correctly based on available data', () => {
      ArtistProfilePage
        .visit(40)
        .waitForLoad()
      ArtistProfilePage.getArtistName()
        .should('be.visible')
        .and('not.be.empty')
        .then(($name) => {
          cy.log(`Artist name displayed: ${$name.text()}`)
        })
    })
  })
})