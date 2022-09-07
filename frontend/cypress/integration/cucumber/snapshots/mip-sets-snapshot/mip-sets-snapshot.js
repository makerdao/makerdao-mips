/// <reference types="cypress" />

const mipsets = [
  "collateral-onboarding-mipset",
  "core-governance-mipset",
  "core-unit-framework-mipset",
];

Given("The user opens MIP Sets view", () => {
  cy.visit("/mips/list?mipsetMode=true");
});

And("MIP Set number {string} is open", (mipNumber) => {
  cy.wait(10000); // todo find an alternative for the long wait
  cy.get(`[data-cy=mipset-row-${mipsets[+mipNumber - 1]}]`).click();
});

And("MIP Set number {string} is open in mobile mode", (mipNumber) => {
  cy.wait(10000); // todo find an alternative for the long wait
  cy.get("div.mobile > button")
    .eq(+mipNumber - 1)
    .click();
});

Then(
  "MIP Set number {string} should match snapshot with image suffix {string}",
  (mipNumber, imageSuffix) => {
    cy.get("tr.maker-detail-mipset-row")
      .eq(+mipNumber - 1)
      .then(($el) => {
        cy.testScreenshot(
          $el,
          `mip-sets/${mipsets[+mipNumber - 1]}-${imageSuffix}`
        );
      });
  }
);

Then(
  "MIP Set number {string} should match snapshot with image suffix {string} in mobile mode",
  (mipNumber, imageSuffix) => {
    cy.get("div.ng-trigger-mipsetExpand")
      .eq(+mipNumber - 1)
      .then(($el) => {
        cy.testScreenshot(
          $el,
          `mip-sets/${mipsets[+mipNumber - 1]}-${imageSuffix}`
        );
      });
  }
);
