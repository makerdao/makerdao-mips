describe('Test Regular Search', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('should return 404 page when visiting non existing URL', () => {
    cy.visit('non-existent-url')
    cy.get('app-page-not-found').should('be.visible')
    cy.get('app-page-not-found button').should('contain.text','Back to Home')
    cy.get('app-page-not-found button').click()
    cy.url().should('include','/mips/list')
  })
})
