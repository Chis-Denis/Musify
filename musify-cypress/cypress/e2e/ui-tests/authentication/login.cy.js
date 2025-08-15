import { login } from '../../utils/loginUtils.js'

describe('Login Functionality', () => {
  let users

  beforeEach(() => {
    cy.fixture('users').then((usersData) => {
      users = usersData
    })
  })

  it('should successfully login with valid credentials', () => {
    const email = users?.validUser2?.email
    const password = users?.validUser2?.password
    
    login(email, password)
    cy.wait(1000) 
  })
})
