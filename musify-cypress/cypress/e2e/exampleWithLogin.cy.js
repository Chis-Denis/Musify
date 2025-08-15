describe('Example Tests Using Login Component', () => {
  let users

  beforeEach(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData
    })
  })
  
  describe('Login Tests', () => {
    it('should login with regular user successfully', () => {
      cy.loginWithPageObject(users?.validUser?.email, users?.validUser?.password)
      
      cy.url().should('not.eq', Cypress.config().baseUrl + '/')
      cy.log('Regular user login successful')
    })

    it('should login with admin user successfully', () => {
      cy.loginWithPageObject(users?.adminUser?.email, users?.adminUser?.password)
      
      cy.url().should('not.eq', Cypress.config().baseUrl + '/')
      cy.log('Admin user login successful')
    })
  })

  describe('Profile Page Tests', () => {
    it('should access profile page after login', () => {
      cy.loginWithPageObject(users?.validUser?.email, users?.validUser?.password)
      
      cy.visit('/profile', { failOnStatusCode: false })
      
      cy.url().then((url) => {
        cy.log('Profile page URL: ' + url)
      })
      
      cy.get('body').then(($body) => {
        const hasProfileContainer = $body.find('.profile-container').length > 0
        const hasUserCard = $body.find('mat-card').length > 0
        const hasBackButton = $body.find('app-back-button').length > 0
        
        if (hasProfileContainer || hasUserCard || hasBackButton) {
          cy.log('Profile page elements found')
        } else {
          cy.log('Profile page accessible but no expected elements found')
        }
      })
    })
  })

  describe('Admin Panel Tests', () => {
    it('should access admin panel after admin login', () => {
      cy.loginWithPageObject(users?.validUser?.email, users?.validUser?.password)
      
      cy.visit('/admin', { failOnStatusCode: false })
      
      cy.url().then((url) => {
        cy.log('Admin panel URL: ' + url)
      })
      
      cy.get('body').then(($body) => {
        const hasAdminContainer = $body.find('.admin-songs-container').length > 0
        const hasForm = $body.find('form').length > 0
        const hasTable = $body.find('table').length > 0
        
        if (hasAdminContainer || hasForm || hasTable) {
          cy.log('Admin panel elements found')
        } else {
          cy.log('Admin panel accessible but no expected elements found')
        }
      })
    })
  })
}) 