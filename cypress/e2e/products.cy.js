describe('Product Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display products on homepage', () => {
    // Check if products section exists
    cy.get('[data-testid="products-section"]').should('be.visible')
    cy.get('[data-testid="products-heading"]').should('contain.text', 'Products')
    
    // Check if product cards are displayed
    cy.get('[data-testid="products-grid"]').should('be.visible')
    cy.get('[data-testid^="product-card-"]').should('have.length.at.least', 1)
  })

  it('should navigate to products page and filter products', () => {
    // Navigate to products page using navbar
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    cy.url().should('include', '/products')
    
    // Check if filter components exist
    cy.get('[data-testid="filter-container"]').should('be.visible')
    cy.get('[data-testid="search-input"]').should('be.visible')
    
    // Test search functionality
    cy.get('[data-testid="search-input"]').type('product')
    cy.wait(1000) // Wait for debounced search
    
    // Check if products are displayed
    cy.get('[data-testid="products-grid"]').should('be.visible')
  })

  it('should open product view modal when clicking on product', () => {
    // Go to products page using navbar
    cy.get('[data-testid="navbar"] [data-testid="products-link"]').click()
    
    // Click on first product image
    cy.get('[data-testid^="product-image-"]').first().click()
    
    // Check if modal opens
    cy.get('[data-testid="product-view-modal"]').should('be.visible')
    cy.get('[data-testid="modal-product-name"]').should('be.visible')
    cy.get('[data-testid="modal-close-button"]').should('be.visible')
    
    // Close modal
    cy.get('[data-testid="modal-close-button"]').click()
    cy.get('[data-testid="product-view-modal"]').should('not.exist')
  })
})