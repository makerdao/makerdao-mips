/// <reference types="Cypress" />

const { Given } = require("cypress-cucumber-preprocessor/steps");

Given("Dark mode is toggled", () => {
  cy.get("div.darkModeToggler").click();
});

Then("The main container should use the darkmode classes", () => {
  cy.get(".container.list-page-container-dark").should("be.visible");
});

