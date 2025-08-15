describe('Register Page Tests', () => {
  beforeEach(() => {
    cy.visitRegister()
  })

  let testData
  before(() => {
    cy.fixture('register').then((data) => {
      testData = data
    })
  })

  describe('Page Loading and Elements', () => {
    it('should load register page with all elements visible', () => {
      cy.verifyRegisterPage()
    })

    it('should display correct page title', () => {
      cy.get('mat-card-title').should('contain', 'Register')
    })

    it('should have all required form fields', () => {
      cy.get('input[name="firstName"]').should('be.visible')
      cy.get('input[name="lastName"]').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[name="country"]').should('be.visible')
    })

    it('should have register button and login link', () => {
      cy.get('button[type="submit"]').should('be.visible').and('contain', 'Register')
      cy.get('a[routerLink="/login"]').should('be.visible').and('contain', 'Login')
    })
  })

  describe('Form Validation', () => {
    it('should have register button disabled initially', () => {
      cy.verifyRegisterButtonState(true)
    })

    it('should enable register button when all fields are filled', () => {
      cy.fillRegisterForm(testData.validUsers[0])
      cy.verifyRegisterButtonState(false)
    })

    it('should test required field validation step by step', () => {
      cy.testRegisterValidation()
    })

    it('should disable button when any field is cleared', () => {
      cy.fillRegisterForm(testData.validUsers[0])
      cy.verifyRegisterButtonState(false)

      cy.get('input[name="firstName"]').clear()
      cy.verifyRegisterButtonState(true)
    })
  })

  describe('Form Interactions', () => {
    it('should clear form fields when clearForm is called', () => {
      cy.fillRegisterForm(testData.validUsers[0])
      
      cy.clearRegisterForm()
      
      cy.get('input[name="firstName"]').should('have.value', '')
      cy.get('input[name="lastName"]').should('have.value', '')
      cy.get('input[name="email"]').should('have.value', '')
      cy.get('input[name="password"]').should('have.value', '')
      cy.get('input[name="country"]').should('have.value', '')
    })

    it('should handle individual field input', () => {
      const user = testData.validUsers[0]
      
      cy.get('input[name="firstName"]').type(user.firstName)
      cy.get('input[name="firstName"]').should('have.value', user.firstName)
      
      cy.get('input[name="lastName"]').type(user.lastName)
      cy.get('input[name="lastName"]').should('have.value', user.lastName)
      
      cy.get('input[name="email"]').type(user.email)
      cy.get('input[name="email"]').should('have.value', user.email)
      
      cy.get('input[name="password"]').type(user.password)
      cy.get('input[name="password"]').should('have.value', user.password)
      
      cy.get('input[name="country"]').type(user.country)
      cy.get('input[name="country"]').should('have.value', user.country)
    })
  })

  describe('Successful Registration', () => {
    it('should successfully register with valid data', () => {
      cy.fillRegisterForm(testData.testScenarios.successfulRegistration.data)
      cy.submitRegisterForm()
      
      cy.url().should('not.include', '/register')
    })

    it('should handle registration with different data formats', () => {
      testData.validUsers.forEach((userData, index) => {
        cy.visitRegister()
        cy.fillRegisterForm(userData)
        cy.verifyRegisterButtonState(false)
        cy.submitRegisterForm()
      })
    })
  })

  describe('Error Handling', () => {
    it('should show error for duplicate email', () => {
      cy.fillRegisterForm(testData.duplicateEmail)
      cy.submitRegisterForm()
      
      cy.visitRegister()
      cy.fillRegisterForm(testData.duplicateAttempt)
      cy.submitRegisterForm()
      
      cy.verifyAnyRegisterError()
    })

    it('should handle invalid email format', () => {
      testData.invalidEmails.forEach(invalidEmail => {
        cy.visitRegister()
        cy.fillRegisterForm({
          ...testData.validUsers[0],
          email: invalidEmail
        })
        cy.submitRegisterForm()
        cy.verifyAnyRegisterError()
      })
    })

    it('should handle weak password', () => {
      testData.weakPasswords.forEach(weakPassword => {
        cy.visitRegister()
        cy.fillRegisterForm({
          ...testData.validUsers[0],
          password: weakPassword
        })
        cy.submitRegisterForm()
        cy.verifyAnyRegisterError()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate to login page when login link is clicked', () => {
      cy.navigateToLoginFromRegister()
      cy.url().should('include', '/login')
    })

    it('should maintain form data when navigating back', () => {
      cy.fillRegisterForm(testData.validUsers[0])
      
      cy.navigateToLoginFromRegister()
      cy.visitRegister()
      
      cy.get('input[name="firstName"]').should('have.value', '')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long input values', () => {
      cy.fillRegisterForm(testData.longInputs)
      
      cy.verifyRegisterButtonState(false)
    })

    it('should handle special characters in input fields', () => {
      cy.fillRegisterForm(testData.specialChars)
      
      cy.verifyRegisterButtonState(false)
    })

    it('should handle empty strings vs no input', () => {
      cy.get('input[name="firstName"]').type(testData.whitespace.firstName)
      cy.get('input[name="lastName"]').type(testData.whitespace.lastName)
      cy.get('input[name="email"]').type(testData.whitespace.email)
      cy.get('input[name="password"]').type(testData.whitespace.password)
      cy.get('input[name="country"]').type(testData.whitespace.country)
      
      cy.verifyRegisterButtonState(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      testData.formLabels.forEach(label => {
        cy.get('mat-label').should('contain', label)
      })
    })

    it('should have required attributes on form fields', () => {
      testData.requiredFields.forEach(field => {
        cy.get(`input[name="${field}"]`).should('have.attr', 'required')
      })
    })
  })
})
