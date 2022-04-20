/// <reference types="cypress" />

import "cypress-real-events/support";
describe('Initial Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('open home page when clicking on MIP\'s Portal button', () => {
    cy.get("[data-cy=go-home-link]").click();
    cy.url().should('include', '/mips/list');

    cy.visit('/mips/details/MIP0');
    cy.get("[data-cy='go-home-link']").click();
    cy.url().should('include', '/mips/list');
  })

  it('shows and hide Go Top component', () => {
    cy.get("[data-cy=button-go-top]").should('not.be.visible');
    cy.scrollTo(0, 500);
    cy.get("[data-cy=button-go-top]").should('be.visible');
    cy.get("[data-cy=button-go-top]").click();
    cy.get("[data-cy=button-go-top]").should('be.visible');
    cy.scrollTo(0, 0);
    cy.get("[data-cy=button-go-top]").should('not.be.visible');
  })
})

