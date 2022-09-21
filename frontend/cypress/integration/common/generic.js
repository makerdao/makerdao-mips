/// <reference types="Cypress" />

And("The viewport is fixed to 1536x600", () => {
  cy.viewport(1536, 600);
});

And("The viewport is fixed to 375x667", () => {
  cy.viewport(375, 667);
});

And("{string} ms are past", (ms) => {
  cy.wait(+ms);
});

And("The page is reloaded", () => {
  cy.reload();
});

And("The user opens the main page", () => {
  cy.visit("");
});

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeMips } = require("../../helpers/fake-mip");
const { fakeMip } = require("../../helpers/fake-mip-details");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");

And("Backend data is set to be mocked", () => {
  fakeVars();
  fakeNews();
  fakeMips();
  fakeMip();
  fakeMenu();
});

And("Vars data is set to be mocked in spanish", () => {
  fakeVars("es");
});