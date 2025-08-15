class ArtistProfilePage {
  
  elements = {
    
    loadingContainer: '.loading',
    loadingSpinner: 'mat-spinner',
    loadingText: 'p:contains("Loading...")',
    
    
    artistContainer: 'ng-container',
    
    
    artistHeaderBox: '.artist-header-box',
    songHeader: '.song-header',
    songCover: '.song-cover',
    emojiIcon: '.emoji-icon',
    songInfo: '.song-info',
    artistName: '.artist-name',
    artistCaption: '.mat-caption',
    
    
    locationText: 'p:contains("place")',
    activeTimeText: 'p:contains("schedule")',
    birthdayText: 'p:contains("cake")',
    
    
    artistSection: '.artist-section',
    membersSection: '.artist-section:contains("Members")',
    bandsSection: '.artist-section:contains("Bands")',
    albumsSection: '.artist-section:contains("Albums")',
    songsSection: '.artist-section:contains("Songs")',
    
    
    cardGrid: '.card-grid',
    miniCard: '.mini-card',
    
    
    matIcon: 'mat-icon',
    groupIcon: 'mat-icon:contains("group")',
    albumIcon: 'mat-icon:contains("album")',
    musicIcon: 'mat-icon:contains("music_note")',
    
    
    memberCard: '.artist-section:contains("Members") .mini-card',
    bandCard: '.artist-section:contains("Bands") .mini-card',
    albumCard: '.artist-section:contains("Albums") .mini-card',
    songCard: '.artist-section:contains("Songs") .mini-card'
  }

  
  config = {
    scrollBehavior: { ensureScrollable: false }
  }

  visit(artistId) {
    cy.visit(`/home/artists/${artistId}`, { failOnStatusCode: false })
    return this
  }

  
  waitForLoad() {
    cy.get('body').then(($body) => {
      if ($body.find(this.elements.loadingContainer).length > 0) {
        cy.get(this.elements.loadingContainer)
          .should('not.exist')
      }
    })
    cy.get(this.elements.artistHeaderBox)
      .should('be.visible')
    
    return this
  }

  
  verifyLoadingState() {
    cy.get('body').then(($body) => {
      if ($body.find(this.elements.loadingContainer).length > 0) {
        cy.get(this.elements.loadingContainer).should('be.visible')
        cy.get(this.elements.loadingSpinner).should('be.visible') 
        cy.get(this.elements.loadingText).should('be.visible')
        cy.log('Loading state verified')
      } else {
        cy.log('Loading state not present - page loaded quickly')
      }
    })
    return this
  }

  
  isArtistProfilePage() {
    cy.url().should('include', '/home/artists/')
    cy.get(this.elements.artistHeaderBox).should('be.visible')
    cy.get(this.elements.artistCaption).should('contain.text', 'Artist')
    return this
  }

  
  verifyHeaderElements() {
    cy.get(this.elements.artistHeaderBox).should('be.visible')
    cy.get(this.elements.songHeader).should('be.visible')
    cy.get(this.elements.songCover).should('be.visible')
    cy.get(this.elements.emojiIcon).should('be.visible')
    cy.get(this.elements.songInfo).should('be.visible')
    cy.get(this.elements.artistName).should('be.visible')
    cy.get(this.elements.artistCaption).should('contain.text', 'Artist')
    return this
  }

  
  getArtistName() {
    return cy.get(this.elements.artistName)
  }

  getArtistIcon() {
    return cy.get(this.elements.emojiIcon)
  }

  getLocationInfo() {
    return cy.get(this.elements.locationText)
  }

  getActiveTimeInfo() {
    return cy.get(this.elements.activeTimeText)
  }

  getBirthdayInfo() {
    return cy.get(this.elements.birthdayText)
  }

  
  verifyArtistInfo(expectedName) {
    this.getArtistName().should('be.visible').and('not.be.empty')
    if (expectedName) {
      this.getArtistName().should('contain.text', expectedName)
    }
    this.getArtistIcon().should('be.visible')
    return this
  }

  
  verifyMembersSection() {
    cy.get(this.elements.membersSection).should('be.visible')
    cy.get(this.elements.membersSection).scrollIntoView(this.config.scrollBehavior)
    
    cy.get(this.elements.membersSection).within(() => {
      cy.get('mat-icon').should('contain.text', 'group')
    })
    return this
  }

  getMemberCards() {
    return cy.get(this.elements.memberCard)
  }

  clickMember(memberIndex) {
    cy.get(this.elements.memberCard).eq(memberIndex).click()
    return this
  }

  
  verifyBandsSection() {
    cy.get(this.elements.bandsSection).should('be.visible')
    cy.get(this.elements.bandsSection).within(() => {
      cy.get('mat-icon').should('contain.text', 'group')
    })
    return this
  }

  getBandCards() {
    return cy.get(this.elements.bandCard)
  }

  clickBand(bandIndex) {
    cy.get(this.elements.bandCard).eq(bandIndex).click()
    return this
  }

  
  verifyAlbumsSection() {
    cy.get(this.elements.albumsSection).should('be.visible')
    cy.get(this.elements.albumsSection).scrollIntoView(this.config.scrollBehavior)
    cy.get(this.elements.albumsSection).within(() => {
      cy.get('mat-icon').should('contain.text', 'album')
    })
    return this
  }

  getAlbumCards() {
    return cy.get(this.elements.albumCard)
  }

  clickAlbum(albumIndex) {
    cy.get(this.elements.albumCard).eq(albumIndex).click()
    return this
  }

  
  
  verifySongsSection() {
    cy.get(this.elements.songsSection).scrollIntoView(this.config.scrollBehavior)
    cy.get(this.elements.songsSection).should('exist')
    cy.get(this.elements.songsSection).then(($el) => {
      const rect = $el[0].getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      if (!isVisible) {
        cy.scrollTo('bottom', this.config.scrollBehavior)
      }
    })
    
    cy.get(this.elements.songsSection).should('be.visible')
    cy.get(this.elements.songsSection).within(() => {
      cy.get('mat-icon').should('contain.text', 'music_note')
    })
    return this
  }

  getSongCards() {
    return cy.get(this.elements.songCard)
  }

  clickSong(songIndex) {
    cy.get(this.elements.songCard).eq(songIndex).click()
    return this
  }

  
  verifySection(sectionName) {
    cy.get(`.artist-section:contains("${sectionName}")`).should('be.visible')
    return this
  }

  
  
  verifyAllSections() {
    cy.scrollTo('top', this.config.scrollBehavior)
    cy.get('body').then(($body) => {
      if ($body.find(this.elements.membersSection).length > 0) {
        cy.log('Verifying Members section')
        this.verifySectionWithScroll(this.elements.membersSection, 'group', 'Members')
      } else {
        cy.log('Members section not found - this may be expected for solo artists')
      }
      
      if ($body.find(this.elements.bandsSection).length > 0) {
        cy.log('Verifying Bands section')
        this.verifySectionWithScroll(this.elements.bandsSection, 'group', 'Bands')
      } else {
        cy.log('Bands section not found')
      }
      
      if ($body.find(this.elements.albumsSection).length > 0) {
        cy.log('Verifying Albums section')
        this.verifySectionWithScroll(this.elements.albumsSection, 'album', 'Albums')
      } else {
        cy.log('Albums section not found')
      }
      
      if ($body.find(this.elements.songsSection).length > 0) {
        cy.log('Verifying Songs section')
        this.verifySectionWithScroll(this.elements.songsSection, 'music_note', 'Songs')
      } else {
        cy.log('Songs section not found')
      }
    })
    return this
  }

  
  getMembersCount() {
    return cy.get(this.elements.memberCard).its('length')
  }

  getBandsCount() {
    return cy.get(this.elements.bandCard).its('length')
  }

  getAlbumsCount() {
    return cy.get(this.elements.albumCard).its('length')
  }

  getSongsCount() {
    return cy.get(this.elements.songCard).its('length')
  }

  
  verifyResponsiveLayout() {
    cy.get(this.elements.cardGrid).should('exist')
    cy.get(this.elements.cardGrid).then(($grids) => {
      if ($grids.length > 0) {
        cy.get(this.elements.cardGrid).first().should('have.css', 'display', 'flex')
      }
    })
    return this
  }

  
  verifyCardHoverEffect(cardType, index) {
    const cardSelector = this.elements[`${cardType}Card`]
    cy.get(cardSelector).eq(index).trigger('mouseover')
    return this
  }

  
  verifyArtistType(expectedType) {
    if (expectedType === 'band') {
      this.getArtistIcon().should('contain.text', '👥')
    } else {
      this.getArtistIcon().should('contain.text', '👤')
    }
    return this
  }

  
  clickCardSafely(cardSelector, index) {
    cy.get(cardSelector).then(($cards) => {
      if ($cards.length > index) {
        cy.get(cardSelector).eq(index).click()
      } else {
        cy.log(`Warning: Card index ${index} not found in ${cardSelector}`)
      }
    })
    return this
  }

  
  verifySectionWithScroll(sectionSelector, expectedIcon, sectionName) {
    cy.get(sectionSelector).should('exist')
    cy.scrollTo('top', this.config.scrollBehavior)
    cy.get(sectionSelector).scrollIntoView(this.config.scrollBehavior)
    
    cy.get(sectionSelector).then(($el) => {
      if (!Cypress.dom.isVisible($el[0])) {
        cy.scrollTo('bottom', this.config.scrollBehavior)
        cy.get(sectionSelector).scrollIntoView(this.config.scrollBehavior)
      }
    })
    
    
    cy.get(sectionSelector).should('be.visible')
    
    if (expectedIcon) {
      cy.get(sectionSelector).within(() => {
        cy.get('mat-icon').should('contain.text', expectedIcon)
      })
    }
    
    cy.log(`✓ ${sectionName} section verified`)
    return this
  }

  
  verifySongsSection() {
    return this.verifySectionWithScroll(
      this.elements.songsSection, 
      'music_note', 
      'Songs'
    )
  }

  
  verifySectionSafely(sectionSelector, expectedIcon, sectionName) {
    cy.get(sectionSelector).should('exist')
    cy.get(sectionSelector).scrollIntoView(this.config.scrollBehavior)
    
    cy.get(sectionSelector).should('be.visible')
    cy.get(sectionSelector).within(() => {
      if (expectedIcon) {
        cy.get('mat-icon').should('contain.text', expectedIcon)
      }
    })
    cy.log(`✓ ${sectionName} section verified`)
    return this
  }
}

export default new ArtistProfilePage()