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
  cy.wait(10000); // todo find an alternative for the long wait
});
