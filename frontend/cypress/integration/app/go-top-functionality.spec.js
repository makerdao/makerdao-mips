/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('Go Top Functionaliy', () => {
    beforeEach(() => {
       cy.visit('')
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

  it('shows and hide Go Top component in darkmode', () => {
    cy.get('div.darkModeToggler').click()
    cy.scrollTo(0, 0);
    cy.get("[data-cy=button-go-top]").should('not.be.visible');
    cy.scrollTo(0, 500);
    cy.get("[data-cy=button-go-top]").should('be.visible');
    cy.get("[data-cy=button-go-top]").click();
    cy.get("[data-cy=button-go-top]").should('be.visible');
    cy.scrollTo(0, 0);
    cy.get("[data-cy=button-go-top]").should('not.be.visible');
  })

  it('shows and hide Go Top component in spanish language', () => {
    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(0).click()
    cy.scrollTo(0, 0);
    cy.get("[data-cy=button-go-top]").should('not.be.visible');
    cy.scrollTo(0, 500);
    cy.get("[data-cy=button-go-top]").should('be.visible');
    cy.get("[data-cy=button-go-top]").click();
    cy.get("[data-cy=button-go-top]").should('be.visible');
    cy.scrollTo(0, 0);
    cy.get("[data-cy=button-go-top]").should('not.be.visible');
  })
  })
