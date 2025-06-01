describe('Checkout Process Tests', () => {
  beforeEach(() => {
    // Login before checkout tests
    cy.visit('/login')
    cy.get('[data-testid="login-container"] [data-testid="username-input"]').type('user1')
    cy.get('[data-testid="login-container"] [data-testid="password-input"]').type('password1')
    cy.get('[data-testid="login-form"] [data-testid="login-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/profile')
  })

  it('should access checkout page with items in cart', () => {
    // Add item to cart first using navbar
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    cy.wait(1000)
    
    // Go to cart and proceed to checkout using navbar
    cy.get('[data-testid="navbar"] [data-testid="cart-link"]').click()
    cy.get('[data-testid="checkout-button"]').click()
    
    // Should be on checkout page
    cy.url().should('include', '/checkout')
    cy.get('[data-testid="checkout-container"]').should('be.visible')
    cy.get('[data-testid="checkout-stepper"]').should('be.visible')
  })

  it('should display checkout steps', () => {
    // Add item and go to checkout using navbar
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    cy.wait(1000)
    cy.get('[data-testid="navbar"] [data-testid="cart-link"]').click()
    cy.get('[data-testid="checkout-button"]').click()
    
    // Check checkout steps
    cy.get('[data-testid="checkout-step-0"]').should('contain.text', 'Address')
    cy.get('[data-testid="checkout-step-1"]').should('contain.text', 'Payment Method')
    cy.get('[data-testid="checkout-step-2"]').should('contain.text', 'Order Summary')
    
    // Should show address step first
    cy.get('[data-testid="address-step"]').should('be.visible')
  })
})