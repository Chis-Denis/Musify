describe('API Tests with Auth', () => {
  
  let userId

  beforeEach(function () {
    cy.loginAPI('userForApiTest')
      .then(() => {
        cy.get('@authToken').then(token => {
          this.authToken = token
        })
      })
  })

  it('GET /api/User - should return list of users with valid token', function () {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/User`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      cy.log('Users fetched:', JSON.stringify(response.body))
      expect(response.body).to.be.an('array')
      if (response.body.length > 0) {
        expect(response.body[0]).to.have.all.keys(
          'id', 'firstName', 'lastName', 'email', 'country', 'role', 'isActive', 'isDeleted'
        )
      }
    })
  })

  
  it('POST /api/User - should create a new user with valid data', function () {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `testuser_${Date.now()}@example.com`, 
      password: 'StrongPass1!',
      country: 'Romania',
      role: 'user',
      isActive: true
    }

    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/User`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      },
      body: newUser,
      failOnStatusCode: false 
    }).then((response) => {
      cy.log('Status:', response.status)
      cy.log('Body:', JSON.stringify(response.body))

      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('id')
      expect(response.body.email).to.eq(newUser.email)
    })
  })

   it('should fetch a list of users and save the first user id', function () {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/User`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.be.greaterThan(0)

      userId = response.body[27].id
      cy.log('Saved userId:', userId)
    })
  })

  it('should fetch a user by ID', function () {
    expect(userId).to.exist

    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/api/User/${userId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log('GET /api/User/{id} response:', JSON.stringify(response.body))
      expect(response.status).to.eq(200)
      expect(response.body).to.have.all.keys(
        'id', 'firstName', 'lastName', 'email', 'country', 'role', 'isActive', 'isDeleted'
      )
      expect(response.body.id).to.eq(userId)
    })
  })

    it('should update the user by ID', function () {
    expect(userId).to.exist

    const updatedUser = {
      id: userId,
      firstName: 'Updated',
      lastName: 'User',
      email: `updateduser_${Date.now()}@example.com`,
      country: 'Germany',
      role: 'user',
      isActive: true,
      isDeleted: false
    }

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/api/User/${userId}`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      },
      body: updatedUser,
      failOnStatusCode: false
    }).then((response) => {
      cy.log('PUT Status:', response.status)
      expect(response.status).to.eq(204) 
    })
  })

    it('should change the password for the logged-in user', function () {
    const payload = {
      currentPassword: 'Hash1New!',  
      newPassword: 'Hash1New!'
    }

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/api/User/change-password`,
      headers: {
        Authorization: `Bearer ${this.authToken}`
      },
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      cy.log('PUT /change-password status:', response.status)
      cy.log('Body:', JSON.stringify(response.body))
      expect(response.status).to.be.oneOf([200,204]) 
    })
  })


  it('should change the role of a user by ID', function () {
  const newRole = 'admin' 
  const targetUserId = 147 

  cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/api/User/${targetUserId}/change-role`,
    headers: {
      Authorization: `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    },
    body: `"${newRole}"`, 
    failOnStatusCode: false
  }).then((response) => {
    cy.log('PUT /change-role status:', response.status)
    cy.log('Body:', JSON.stringify(response.body))

    expect(response.status).to.be.oneOf([200, 204]) 
  })
})


it('should deactivate a user by ID', function () {
  const targetUserId = 22 

  cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/api/User/${targetUserId}/deactivate`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    },
    failOnStatusCode: false
  }).then((response) => {
    cy.log('PUT /deactivate status:', response.status)
    cy.log('Body:', JSON.stringify(response.body))

    expect(response.status).to.be.oneOf([200, 204])
  })
})

it('should activate a user by ID', function () {
  const targetUserId = 22 

  cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/api/User/${targetUserId}/activate`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    },
    failOnStatusCode: false
  }).then((response) => {
    cy.log('PUT /activate status:', response.status)
    cy.log('Body:', JSON.stringify(response.body))

    expect(response.status).to.be.oneOf([200, 204])
  })
})

it('should delete a user by ID', function () {
  const userIdToDelete = 166 

  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/api/User/${userIdToDelete}`,
    headers: {
      Authorization: `Bearer ${this.authToken}`
    },
    failOnStatusCode: false
  }).then((response) => {
    cy.log('DELETE /api/User/{id} status:', response.status)
    expect(response.status).to.eq(204)
  })
})

})

