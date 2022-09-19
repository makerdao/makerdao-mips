/// <reference types="Cypress" />

And("Dark mode is toggled", () => {
  cy.get("div.darkModeToggler").click().trigger("blur");
});

Then("The main container should use the darkmode classes", () => {
  cy.get(".container.list-page-container-dark").should("be.visible");
});

Then(/^The main container should NOT use the darkmode classes$/, function () {
  cy.get(".container").should("not.have.class", "list-page-container-dark");
});

Then(
  "View {string} should have a dark background class with value {string}",
  (selector, cl) => {
    cy.get(selector).eq(0).should("be.visible");
    cy.get(selector).eq(0).should("have.class", cl);
  }
);
