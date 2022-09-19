describe('Test Dark Mode', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('should change to dark or light mode when clicking the corresponding icon', () => {
    cy.get('div.darkModeToggler').click()
    cy.get('.container.list-page-container-dark').should('be.visible')

    cy.get('div.darkModeToggler').click()
    cy.get('.container').should('not.have.class','list-page-container-dark')
  })

  it('should change to dark or light mode when clicking the corresponding icon', () => {
    cy.get('div.darkModeToggler').click()
    cy.get('.container.container-dark').should('be.visible')

    cy.get('div.darkModeToggler').click()
    cy.get('.container').should('not.have.class','container-dark')
  })

})
