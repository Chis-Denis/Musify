  before(() => {
    cy.loginAPI('validUser2') 
  })

  it('should store a valid token', () => {
    cy.get('@authToken').then((token) => {
      expect(token).to.exist
      expect(token).to.match(/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/)
      cy.log('Token:', token)
    })
  })

