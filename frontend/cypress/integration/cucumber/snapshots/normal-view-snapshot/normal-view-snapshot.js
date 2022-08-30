/// <reference types="Cypress" />
const { fakeMenu } = require("../../../../helpers/fake-menu");
const { fakeMips } = require("../../../../helpers/fake-mip");
const { fakeNews } = require("../../../../helpers/fake-news");
const { fakeVars } = require("../../../../helpers/fake-vars");

Given("Backend data is set to be mocked", () => {
  fakeVars();
  fakeNews();
  fakeMips();
  fakeMenu();
});

Then("MIP description component matches snapshot", () => {
  cy.get("[data-cy=table-list-mips] tbody tr")
    .first()
    .then(($tr) => {
      cy.wrap($tr).find("td.mat-column-summary button").click();
      cy.testScreenshot($tr, "normal-view/mip-row-with-expanded-description");
      cy.wrap($tr).find("td.mat-column-summary button").click();
    });
});

Then("MIP components match snapshots", () => {
  cy.get("[data-cy=table-list-mips] tbody tr")
    .first()
    .then(($tr) => {
      cy.wrap($tr).find("td:first-child button").click();
      cy.testScreenshot(
        $tr.next(),
        "normal-view/mip-row-with-expanded-components"
      );
    });
});
