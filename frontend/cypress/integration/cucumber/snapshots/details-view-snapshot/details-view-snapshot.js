/// <reference types="cypress" />

Given("The user opens Details view for MIP1", () => {
  cy.visit("/mips/details/MIP1");
  cy.wait(700);
});
