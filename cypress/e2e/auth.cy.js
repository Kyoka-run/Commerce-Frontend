describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.visit('/') // Visit homepage before each test
  })

  it('should allow user to login with valid credentials', () => {
    // Navigate to login page using navbar login button
    cy.get('[data-testid="navbar"] [data-testid="login-button"]').click()
    
    // Fill login form using login container
    cy.get('[data-testid="login-container"] [data-testid="username-input"]').type('user1')
    cy.get('[data-testid="login-container"] [data-testid="password-input"]').type('password1')
    
    // Submit login using login form button
    cy.get('[data-testid="login-form"] [data-testid="login-button"]').click()
    
    // Verify successful login - should redirect to home and show user menu
    cy.url().should('eq', Cypress.config().baseUrl + '/profile')
    cy.get('[data-testid="navbar-user-menu-container"]').should('be.visible')
  })

  it('should show error for invalid login credentials', () => {
    // Navigate to login page using navbar login button
    cy.get('[data-testid="navbar"] [data-testid="login-button"]').click()
    
    // Fill login form with invalid credentials using login container
    cy.get('[data-testid="login-container"] [data-testid="username-input"]').type('invaliduser')
    cy.get('[data-testid="login-container"] [data-testid="password-input"]').type('wrongpassword')
    
    // Submit login using login form button
    cy.get('[data-testid="login-form"] [data-testid="login-button"]').click()
    
    // Verify error message appears
    cy.contains('Bad credentials').should('be.visible')
  })
})