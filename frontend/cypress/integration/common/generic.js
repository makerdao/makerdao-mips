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
const { fakeMenuLang } = require("../../helpers/fake-menu-lang");
const { fakeMips } = require("../../helpers/fake-mips");
const { fakeMipSpecific } = require("../../helpers/fake-mip-specific");
const { fakeMipBy } = require("../../helpers/fake-mip-by");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");

And("Backend data is set to be mocked", () => {
  fakeVars();
  fakeNews();
  fakeMips();
  fakeMipSpecific();
  fakeMipBy();
  fakeMenu();
  fakeMenuLang();
});

And("Vars data is set to be mocked in spanish", () => {
  fakeVars("es");
});

And("MIPs list is set to be mocked as a large list", () => {
  fakeMips(true);
});
