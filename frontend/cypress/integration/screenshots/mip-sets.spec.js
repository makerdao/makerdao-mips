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

describe("Mip Sets View", () => {
  before(() => {
    fakeVars();
    fakeNews();
    fakeMips();
    fakeMenu();
    cy.viewport("macbook-16");
    cy.visit("/mips/list?mipsetMode=true");
  });

  it("Entire View", () => {
    Cypress.$('app-button-top').remove();
    cy.testScreenshot(null, "mip-sets/entire-view");
  });

  it(`Mip sets`, () => {
    mipsets.forEach((mipset, idx) => {
      fakeMips();
      cy.wait(700);
      cy.get(`[data-cy=mipset-row-${mipset}]`).click();
      cy.wait("@MIPs");
      cy.get("tr.maker-detail-mipset-row")
        .eq(idx)
        .then(($el) => {
          cy.testScreenshot($el, `mip-sets/${mipset}-content`);
        });
      // so it includes the dropdown menu status
      cy.testScreenshot(null, `mip-sets/${mipset}-entire-view`);
      cy.get(`[data-cy=mipset-row-${mipset}]`).click();
      cy.wait(700);
    });
  });
});
