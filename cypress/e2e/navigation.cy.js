describe('Navigation Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate through all main pages', () => {
    // Test Home navigation
    cy.get('[data-testid="navbar"] [data-testid="home-link"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('[data-testid="home-container"]').should('be.visible')
    
    // Test Products navigation
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    cy.url().should('include', '/products')
    cy.get('[data-testid="products-container"]').should('be.visible')
    
    // Test About navigation
    cy.get('[data-testid="navbar"] [data-testid="about-link"]').click()
    cy.url().should('include', '/about')
    cy.get('[data-testid="about-container"]').should('be.visible')
    
    // Test Contact navigation
    cy.get('[data-testid="navbar"] [data-testid="contact-link"]').click()
    cy.url().should('include', '/contact')
    cy.get('[data-testid="contact-container"]').should('be.visible')
  })

  it('should display responsive navbar', () => {
    // Check if navbar exists
    cy.get('[data-testid="navbar"]').should('be.visible')
    cy.get('[data-testid="brand-logo"]').should('be.visible')
    cy.get('[data-testid="nav-links"]').should('be.visible')
    
    // Test mobile menu (simulate mobile view)
    cy.viewport('iphone-6')
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible')
    cy.get('[data-testid="mobile-menu-button"]').click()
    cy.get('[data-testid="nav-links"]').should('have.class', 'h-fit')
  })
})