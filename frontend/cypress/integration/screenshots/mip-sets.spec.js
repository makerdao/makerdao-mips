/// <reference types="cypress" />

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeMips } = require("../../helpers/fake-mip");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");

const mipsets = [
  "collateral-onboarding-mipset",
  "core-governance-mipset",
  "core-unit-framework-mipset",
];

describe("Normal List View", () => {
  before(() => {
    fakeVars();
    fakeNews();
    fakeMips();
    fakeMenu();
    cy.viewport("macbook-16");
    cy.visit("/mips/list?mipsetMode=true");
  });

  it("Entire View", () => {
    // Cypress.$('app-button-top').remove();
    cy.testScreenshot(null, "mip-sets/entire-view");
  });

  it(`Mip sets`, () => {
    mipsets.forEach((mipset, idx) => {
      cy.wait(700);
      fakeMips();
      cy.get(`[data-cy=mipset-row-${mipset}]`).click();
      cy.wait("@MIPs");
      cy.get("tr.maker-detail-mipset-row")
        .eq(idx)
        .then(($el) => {
          cy.testScreenshot($el, `mip-sets/${mipset}-content`);
        });
      cy.get(`[data-cy=mipset-row-${mipset}]`).click();
      cy.wait(700);
    });
  });
});
