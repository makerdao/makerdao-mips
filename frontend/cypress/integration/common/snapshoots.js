Then("Global snapshot matches with image {string}", (imageName) => {
  Cypress.$("app-button-top").remove();
  cy.testScreenshot(null, imageName);
});

Then(
  "{string} component with selector {string} matches snapshot for image name {string}",
  (_name, selector, imageName) => {
    cy.get(selector)
    .first()
    .then(($el) => {
      cy.testScreenshot($el, imageName);
    });
  }
);
