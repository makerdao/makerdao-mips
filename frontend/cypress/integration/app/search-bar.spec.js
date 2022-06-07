/// <reference types="cypress" />

const simpleSearch = "options";
const mipSearch = "MIP32";
const dollarSearch = "$ @ACCEPTED";

describe("Search Bar functionality", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it('The results of simple queries must contain the entered text', () => {
    cy.get("[data-cy=search-input]")
    .click()
    .type(simpleSearch)
    .type('{enter}')
    .get("[data-cy=hide-parent-checkbox] label")
    .click();

    cy.get('tr[data-cy=search-result]')
      .each((_, index) => {
        cy.get('tr[data-cy=search-result]')
          .eq(index)
          .click()
          .get('[data-cy=mip-content]')
          .contains(simpleSearch, { matchCase: false })
          .should('exist')
          .go('back');
      });


      cy.get('[data-cy=subporposal-item]')
        .each((_, index) => {
          cy.get('[data-cy=subporposal-item]')
            .eq(index)
            .click()
            .get('[data-cy=mip-content]')
            .contains(simpleSearch, { matchCase: false })
            .should('exist')
            .go('back');
        })
  })
});
