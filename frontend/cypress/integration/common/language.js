/// <reference types="Cypress" />

const { Given } = require("cypress-cucumber-preprocessor/steps");

Given("The user selects {string} language", (language) => {
  // assertion to wait in case it's still loading (double check)
  cy.get("div.maker-loading-shade ng-star-inserted").should("not.exist");
  cy.location().then((loc) => {
    cy.intercept(loc.toString()).as("reloadRequest");
  });
  cy.get("a.language-menu").click();
  cy.get("div.language-menu > app-menu > a > span").contains(language).click();
  cy.wait("@reloadRequest");
  cy.get("div.maker-loading-shade ng-star-inserted").should("not.exist");
});
