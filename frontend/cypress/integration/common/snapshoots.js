Given("The go-to-top button is removed from the view", () => {
  Cypress.$("app-button-top").remove();
});

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

Then(
  "{string} component with selector {string} opened by clicking {string} matches snapshot for image name {string}",
  (_name, selector,clickSelector, imageName) => {
    cy.get(clickSelector).first().click({force:true});
    cy.wait(700);
    cy.get(selector)
      .first()
      .then(($el) => {
        cy.testScreenshot($el, imageName);
       });
  }
);
