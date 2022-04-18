/// <reference types="cypress" />

describe('example e2e tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should open first MIP correctly', () => {
    cy.get('app-list table tbody tr').first().find('a').first().click();
    cy.url().should('include','/mips/details');
  })
})
