class RegisterPage {
    elements = {
        firstNameInput: () => cy.get('input[name="firstName"]'),
        lastNameInput: () => cy.get('input[name="lastName"]'),
        emailInput: () => cy.get('input[name="email"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        confirmPasswordInput: () => cy.get('input[name="confirmPassword"]').first(),
        countryInput: () => cy.get('input[name="country"]'),
        
        registerButton: () => cy.get('button[type="submit"]'),
        loginLink: () => cy.get('a[routerLink="/login"]'),
        
        errorMessage: () => cy.get('mat-error, .error-message, .alert, .notification, [data-cy=error-message]'),
        toastNotification: () => cy.get('.mat-mdc-snack-bar-container, .mat-snack-bar-container, .toast-error, .toast-warn, .toast-info, .toast-success'),
        
        registerForm: () => cy.get('form'),
        registerCard: () => cy.get('mat-card'),
        registerTitle: () => cy.get('mat-card-title')
    }

    visit() {
        cy.visit('/', { failOnStatusCode: false })
        cy.get('a:contains("Register"), a:contains("Sign Up"), a:contains("Signup"), .signup-link, .register-link').first().click()
    }

    fillFirstName(firstName) {
        this.elements.firstNameInput().clear().type(firstName)
    }

    fillLastName(lastName) {
        this.elements.lastNameInput().clear().type(lastName)
    }

    fillEmail(email) {
        this.elements.emailInput().clear().type(email)
    }

    fillPassword(password) {
        this.elements.passwordInput().clear().type(password)
    }

    fillConfirmPassword(confirmPassword){
        cy.wait(1000) 
        cy.get('input[name="confirmPassword"]').first().clear({force: true}).type(confirmPassword, {force: true})
    }

    fillCountry(country) {
        this.elements.countryInput().clear().type(country)
    }

    fillRegistrationForm(userData) {
        this.fillFirstName(userData.firstName)
        this.fillLastName(userData.lastName)
        this.fillEmail(userData.email)
        this.fillPassword(userData.password)
        this.fillConfirmPassword(userData.confirmPassword)
        this.fillCountry(userData.country)
    }

    submitForm() {
        this.elements.registerButton().click()
    }

    clickLoginLink() {
        this.elements.loginLink().click()
    }

    verifyRegisterButtonDisabled() {
        this.elements.registerButton().should('be.disabled')
    }

    verifyRegisterButtonEnabled() {
        this.elements.registerButton().should('not.be.disabled')
    }

    verifyErrorMessage(message) {
        cy.get('body').then(($body) => {
            if ($body.find('.mat-mdc-snack-bar-container, .mat-snack-bar-container, .toast-error, .toast-warn, .toast-info, .toast-success').length > 0) {
                this.elements.toastNotification().should('be.visible').and('contain', message)
            } else {
                this.elements.errorMessage().should('be.visible').and('contain', message)
            }
        })
    }

    verifyNoErrorMessage() {
        this.elements.errorMessage().should('not.exist')
        this.elements.toastNotification().should('not.exist')
    }

    verifyToastNotification(message) {
        this.elements.toastNotification().should('be.visible').and('contain', message)
    }

    verifyAnyToastNotification() {
        this.elements.toastNotification().should('be.visible')
    }

    dismissToastNotification() {
        this.elements.toastNotification().find('button:contains("Close")').click()
    }

    verifyAnyErrorMessage() {
        cy.get('body').then(($body) => {
            if ($body.find('.mat-mdc-snack-bar-container, .mat-snack-bar-container, .toast-error, .toast-warn, .toast-info, .toast-success').length > 0) {
                this.elements.toastNotification().should('be.visible')
            } else {
                this.elements.errorMessage().should('be.visible')
            }
        })
    }

    verifyRequiredFieldValidation(userData) {
        this.elements.registerButton().should('be.disabled')
        
        this.fillFirstName(userData.firstName)
        this.elements.registerButton().should('be.disabled')
        
        this.fillLastName(userData.firstName)
        this.elements.registerButton().should('be.disabled')
        
        this.fillEmail(userData.email)
        this.elements.registerButton().should('be.disabled')
        
        this.fillPassword(userData.password)
        this.elements.registerButton().should('be.disabled')

        this.fillConfirmPassword(userData.confirmPassword)
        this.elements.registerButton().should('be.disabled')
        
        this.fillCountry(userData.country)
        this.elements.registerButton().should('not.be.disabled')
    }

    verifyPageLoaded() {
        this.elements.registerTitle().should('contain', 'Register')
        this.elements.firstNameInput().should('be.visible')
        this.elements.lastNameInput().should('be.visible')
        this.elements.emailInput().should('be.visible')
        this.elements.passwordInput().should('be.visible')
        this.elements.confirmPasswordInput().should('be.visible')
        this.elements.countryInput().should('be.visible')
        this.elements.registerButton().should('be.visible')
        this.elements.loginLink().should('be.visible')
    }

    clearForm() {
        this.elements.firstNameInput().clear()
        this.elements.lastNameInput().clear()
        this.elements.emailInput().clear()
        this.elements.passwordInput().clear()
        cy.get('input[name="confirmPassword"]').first().clear({force: true})
        this.elements.countryInput().clear()
    }
}

export default  new RegisterPage()