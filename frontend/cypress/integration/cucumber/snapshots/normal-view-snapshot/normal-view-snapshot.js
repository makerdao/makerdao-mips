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

Given("Vars data is set to be mocked in spanish",()=>{
  fakeVars('es');
})

Then("MIP description component matches snapshot with image {string}", (imageName) => {
  cy.get("[data-cy=table-list-mips] tbody tr")
    .first()
    .then(($tr) => {
      cy.wrap($tr).find("td.mat-column-summary button").click();
      cy.testScreenshot($tr, imageName);
      cy.wrap($tr).find("td.mat-column-summary button").click();
    });
});

Then("MIP component matches snapshot with image {string}", (imageName) => {
  cy.get("[data-cy=table-list-mips] tbody tr")
    .first()
    .then(($tr) => {
      cy.wrap($tr).find("td:first-child button").click();
      cy.testScreenshot(
        $tr.next(),
        imageName
      );
    });
});
