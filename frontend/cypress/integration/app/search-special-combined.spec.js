/// <reference types="cypress" />
describe('Special Search', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('')
  })

  it('should find given status in MIPs list', () => {
    const valueOne = '$OR(@ACCEPTED,@OBSOLETE)';

    cy.get('[data-cy=search-input]').clear()
    cy.get('[data-cy=search-input]').type(valueOne)
    cy.get('[data-cy=search-input]').type('{enter}')

    const expressionRegexOne = /(ACCEPTED|OBSOLETE)/i

    cy.get('[data-cy=table-list-mips] tr.maker-element-row:not(.maker-expanded-row) td.mat-column-status').each(($row) => {
      cy.wrap($row).invoke('text').should('match', expressionRegexOne);
    })

    cy.visit('')
    const valueTwo = '$OR(@OBSOLETE,@RFC)'

    cy.get('[data-cy=search-input]').clear()
    cy.get('[data-cy=search-input]').type(valueTwo)
    cy.get('[data-cy=search-input]').type('{enter}')

    const expressionRegexTwo = /(OBSOLETE|RFC)/i

    cy.get('[data-cy=table-list-mips] tr.maker-element-row:not(.maker-expanded-row) td.mat-column-status').each(($row) => {
      cy.wrap($row).invoke('text').should('match', expressionRegexTwo);
    })
  })
});
