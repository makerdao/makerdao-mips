/// <reference types="cypress" />

describe('Dollar search: Search by tag', () => {
  const validTags = ['core unit', 'mip-set', 'collateral-onboarding'];
  const invalidTags = ['non-existent-tag'];

  beforeEach(() => {
    cy.visit('');
  })

  it('MIPs listed should have the tag in the search bar', () => {
    for (const tag of validTags) {
      cy.get('[data-cy=search-input]').clear().type(`$ #${tag}{enter}`);
      cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').each((_, idx) => {
        cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').eq(idx).click();
        cy.get('[data-cy=details-tags]').should('contain', tag);
        cy.go('back')
      })
    }
  })

  it('Should show "No results found" message', () => {
    for (const tag of invalidTags) {
      cy.get('[data-cy=search-input]').clear().type(`$ #${tag}{enter}`);
      cy.get('.no-result p').should('be.visible');
    }
  });
});
