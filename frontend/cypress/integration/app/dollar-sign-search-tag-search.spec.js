/// <reference types="cypress" />

describe('Dollar search: Search by tag', () => {
  const validTags = ['core unit', 'mip-set', 'collateral-onboarding'];
  const invalidTags = ['non-existent-tag'];

  beforeEach(() => {
    cy.visit('');
    cy.viewport('macbook-16');
  })

  it('MIPs listed should have the tag in the search bar', () => {
    for (const tag of validTags) {
      cy.get('[data-cy=search-input]').clear().type(`$ #${tag}{esc}{enter}`);
      cy.forEach('tr[data-cy=search-result], tr[data-cy=subporposal-row]', ($el) => {
        cy.wrap($el).click();
        cy.get('[data-cy=details-tags]').should('contain', tag);
        cy.go('back');
      })
    }
  })

  it('Should show "No results found" message', () => {
    for (const tag of invalidTags) {
      cy.get('[data-cy=search-input]').clear().type(`$ #${tag}{esc}{enter}`);
      cy.wait(500);
      cy.get('.no-result p').should('be.visible');
    }
  });
});
