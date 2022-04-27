/// <reference types="cypress" />
describe('Sample Screenshot tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Takes snapshot of Search Box', () => {
    cy.get("[data-cy='search-box']")
      .compareSnapshot('search-box',{
        errorThreshold: 0.03
      });  // <-- compareSnapshot() is a custom command
  })
})
