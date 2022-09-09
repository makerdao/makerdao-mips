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
    cy.visit(
      "/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md"
    );
  });

  it("Entire View", () => {
    Cypress.$("app-button-top").remove();
    cy.testScreenshot(null, "md-viewer/entire-view");
  });

  it("Content Table", () => {
    cy.testScreenshot(".content", "md-viewer/content-table");
  });

  it("Main content", () => {
    cy.get("app-detail-content")
      .first()
      .then(($el) => {
        cy.testScreenshot($el, "md-viewer/main-content");
      });
  });
});
