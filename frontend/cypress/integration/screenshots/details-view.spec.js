/// <reference types="cypress" />

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeMips } = require("../../helpers/fake-mip");
const { fakeMip } = require("../../helpers/fake-mip-details");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");

describe("Details View", () => {
  before(() => {
    fakeVars();
    fakeNews();
    fakeMips();
    fakeMip();
    fakeMenu();
    cy.viewport(1536, 600);
    cy.visit("/mips/details/MIP1");
  });

  it("Entire View", () => {
    Cypress.$("app-button-top").remove();
    cy.testScreenshot(null, "details-view/entire-view");
  });

  it("Content Table", () => {
    cy.testScreenshot(".content", "details-view/content-table");
  });

  it("Main content", () => {
    cy.get("app-detail-content")
      .first()
      .then(($el) => {
        cy.testScreenshot($el, "details-view/main-content");
      });
  });

  it("Details content", () => {
    cy.get("#details-component")
      .first()
      .then(($el) => {
        cy.testScreenshot($el, "details-view/details");
      });
  });

  it("References", () => {
    cy.get("app-references")
      .first()
      .then(($el) => {
        cy.testScreenshot($el, "details-view/references");
      });
  });

  it("Recent changes", () => {
    cy.get("#pull-request-history")
      .first()
      .then(($el) => {
        cy.testScreenshot($el, "details-view/recent-changes");
      });
  });
});
