describe('Shopping Cart Tests', () => {
  beforeEach(() => {
    // Login before each cart test
    cy.visit('/login')
    cy.get('[data-testid="login-container"] [data-testid="username-input"]').type('user1')
    cy.get('[data-testid="login-container"] [data-testid="password-input"]').type('password1')
    cy.get('[data-testid="login-form"] [data-testid="login-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/profile')
  })

  it('should add product to cart', () => {
    // Go to products page using navbar
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    
    // Add first available product to cart
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    
    // Check for success message (assuming toast notification)
    cy.contains('added to the cart').should('be.visible')
    
    // Check cart badge count updated using navbar cart link
    cy.get('[data-testid="navbar"] [data-testid="cart-link"]').should('contain.text', '1')
  })

  it('should display cart items and allow quantity changes', () => {
    // First add a product to cart using navbar
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    cy.wait(1000)
    
    // Navigate to cart page using navbar
    cy.get('[data-testid="navbar"] [data-testid="cart-link"]').click()
    cy.url().should('include', '/cart')
    
    // Check if cart items are displayed
    cy.get('[data-testid="cart-container"]').should('be.visible')
    cy.get('[data-testid^="cart-item-"]').should('have.length.at.least', 1)
    
    // Test quantity increase
    cy.get('[data-testid^="increase-button-"]').first().click()
    
    // Check if subtotal updated
    cy.get('[data-testid="cart-subtotal"]').should('be.visible')
  })

  it('should remove item from cart', () => {
    // Add product and go to cart using navbar
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    cy.get('[data-testid^="add-to-cart-"]').first().click()
    cy.wait(1000)
    cy.get('[data-testid="navbar"] [data-testid="cart-link"]').click()
    
    // Remove item from cart
    cy.get('[data-testid^="remove-button-"]').first().click()
    
    // Check for removal success message
    cy.contains('removed from cart').should('be.visible')
  })

  it('should show empty cart when no items', () => {
    // Visit cart page directly
    cy.visit('/cart')
    
    // Should show empty cart message
    cy.get('[data-testid="cart-empty-container"]').should('be.visible')
    cy.get('[data-testid="empty-cart-heading"]').should('contain.text', 'Your cart is empty')
    cy.get('[data-testid="start-shopping-link"]').should('be.visible')
  })
})
