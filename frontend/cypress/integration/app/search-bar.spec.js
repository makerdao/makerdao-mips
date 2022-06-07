/// <reference types="cypress" />

const simpleSearch = 'options';
const mipSearch = 'MIP32';
const dollarSearch = '$ @ACCEPTED';

describe("Search Bar functionality", () => {
  beforeEach(() => {
    cy.visit('')
  });

  it('Simple query', () => {
    cy.get('[data-cy=search-input]').click().type(simpleSearch);
  })
});
