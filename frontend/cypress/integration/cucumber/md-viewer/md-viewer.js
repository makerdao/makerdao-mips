/// <reference types="cypress" />

Given("The user navigates md-view for MIP1c4 first subproposal", () => {
  cy.visit(
    "/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md"
  );
});

Given("MIP4 github raw content is set to be mocked", () => {
  cy.intercept(
    "https://raw.githubusercontent.com/makerdao/mips/master/MIP1/MIP1c4-Subproposal-Template.md",
    { fixture: "mip4-raw.txt" }
  ).as('MIP4Raw');
});

When("The user clicks the last entry in the content table", () => {
  cy.get("app-proposal-components a")
    .last()
    .then(($link) => {
      const id = $link.attr("id");
      const sectionName = id.substring(12);
      cy.wrap(sectionName).as("sectionName");
      cy.get("app-proposal-components a").last().click({ force: true });
    });
});

Then("The section name should match the location hash", () => {
  cy.get("@sectionName").then((sectionName) => {
    cy.location("hash").invoke("substring", 1).should("equal", sectionName);
  });
});

Then("The view should scroll to the section", () => {
  cy.get("@sectionName").then((sectionName) => {
    cy.window().then((win) => {
      const $section = Cypress.$(`[name=${sectionName}]`);
      cy.wrap($section.offset());

      cy.wrap(!!$section).should("be.true");

      const elementTop = $section.offset().top;
      const elementBottom = elementTop + $section.outerHeight();

      const viewportTop = Cypress.$(win).scrollTop();
      const viewportBottom = viewportTop + Cypress.$(win).height();

      const isInViewPort =
        elementBottom > viewportTop && elementTop < viewportBottom;

      cy.wrap(isInViewPort).should("be.true");
    });
  });
});

Given("The viewport is extremely stretch", () => {
  cy.viewport(4096, 250); // allows to trigger scroll into every section
});

When("The user scrolls to the header {string}", (headerNumber) => {
  cy.get("h2 a, h3 a")
    .eq(headerNumber)
    .then(($header) => {
      cy.scrollTo(0, $header[0].parentElement.offsetTop + 10);
      cy.wait(100);
      cy.scrollTo(0, $header[0].parentElement.offsetTop);
      cy.wait(100);
    });
});

Then("The location hash should match the header {string}", (headerNumber) => {
  cy.get("h2 a, h3 a")
    .eq(headerNumber)
    .then(($header) => {
      cy.location("hash").invoke("substring", 1).should("equal", $header[0].id);
    });
});

Then(
  "The entry corresponding to section {string} in the content table should be active",
  (headerNumber) => {
    cy.get("app-proposal-components a")
      .eq(+headerNumber + 1)
      .should("have.class", "active");
  }
);
