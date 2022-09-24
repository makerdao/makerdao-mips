/// <reference types="cypress" />

Given("The user opens md viewer for Mip 1 component 4 sub proposal", () => {
  cy.visit(
    "/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md"
  );
  cy.get(".maker-loading-shade").should("not.exist");
  cy.wait(1000);
});

Given("MIP4 github raw content is set to be mocked", () => {
  cy.intercept(
    "https://raw.githubusercontent.com/makerdao/mips/master/MIP1/MIP1c4-Subproposal-Template.md",
    { fixture: "mip4-raw.txt" }
  ).as('MIP4Raw');
});
