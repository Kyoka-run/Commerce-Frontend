Cypress.Commands.add('login', (username = 'user1', password = 'password1') => {
  cy.session([username, password], () => {
    cy.visit('/login')
    cy.get('[data-testid="username-input"]').type(username)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})

Cypress.Commands.add('addProductToCart', () => {
  cy.visit('/products')
  cy.get('[data-testid^="add-to-cart-"]').first().click()
  cy.wait(1000)
})
