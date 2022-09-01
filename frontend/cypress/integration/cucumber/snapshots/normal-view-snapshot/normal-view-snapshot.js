/// <reference types="Cypress" />

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
