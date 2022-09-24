/// <reference types="Cypress" />

Then(
  "MIP description component matches snapshot with image {string}",
  (imageName) => {
    cy.get("[data-cy=table-list-mips] tbody tr")
      .first()
      .then(($tr) => {
        cy.wrap($tr).find("td.mat-column-summary button").click();
        cy.testScreenshot($tr, imageName);
        cy.wrap($tr).find("td.mat-column-summary button").click();
      });
  }
);

Then("MIP component matches snapshot with image {string}", (imageName) => {
  cy.get("[data-cy=table-list-mips] tbody tr")
    .eq(4)
    .then(($tr) => {
      cy.wrap($tr).find("td:first-child button").click();
      cy.testScreenshot($tr.next(), imageName);
    });
});

Then(
  "MIP description component matches snapshot with image {string} in mobile mode",
  (imageName) => {
    cy.get(".mobile-container")
      .eq(3)
      .then(($tr) => {
        cy.wrap($tr).find(".mat-button-wrapper").eq(0).click({ force: true });
        cy.testScreenshot($tr, imageName);
      });
  }
);

Then(
  "MIP component matches snapshot with image {string} in mobile mode",
  (imageName) => {
    cy.get(".mobile-container")
      .eq(3)
      .then(($tr) => {
        cy.wrap($tr).find(".mat-button-wrapper").eq(1).click({ force: true });
        cy.testScreenshot($tr.next(), imageName);
      });
  }
);
