  export class ProfilePage {
    elements = {
      profileContainer: '.profile-container',
      backButton: 'app-back-button',
      userCard: 'mat-card',
      cardHeader: 'mat-card-header',
      cardTitle: 'mat-card-title',
      cardSubtitle: 'mat-card-subtitle',
      cardContent: 'mat-card-content',
      userIcon: 'mat-icon',
      roleText: 'p:contains("Role:")',
      countryText: 'p:contains("Country:")',
      updateProfileComponent: 'app-update-profile',
      deleteAccountComponent: 'app-delete-account',
    }

    visit() {
      cy.visit('/profile', { failOnStatusCode: false })
      return this
    }

    clickBackButton() {
    cy.get('.back-button button').click()
  }


    getUserName() {
      return cy.get(this.elements.cardTitle)
    }

    getUserEmail() {
      return cy.get(this.elements.cardSubtitle)
    }

    getUserRole() {
      return cy.get(this.elements.roleText)
    }

    getUserCountry() {
      return cy.get(this.elements.countryText)
    }

    verifyProfilePage() {
      cy.url().should('include', '/profile')
      cy.get(this.elements.profileContainer).should('be.visible')
      return this
    }

    verifyProfileElements() {
      cy.get(this.elements.profileContainer).should('be.visible')
      cy.get(this.elements.userCard).should('be.visible')
      cy.get(this.elements.cardHeader).should('be.visible')
      cy.get(this.elements.cardTitle).should('be.visible')
      cy.get(this.elements.cardSubtitle).should('be.visible')
      cy.get(this.elements.cardContent).should('be.visible')
      cy.get(this.elements.backButton).should('be.visible')
      return this
    }

    verifyUserInfo() {
      cy.get(this.elements.roleText).should('be.visible')
      cy.get(this.elements.countryText).should('be.visible')
      return this
    }

    openUpdateProfile() {
      cy.get(this.elements.updateProfileComponent).click()
    }

    openDeleteAccount() {
      cy.get(this.elements.deleteAccountComponent).click()
    }
  }

  export default new ProfilePage()
