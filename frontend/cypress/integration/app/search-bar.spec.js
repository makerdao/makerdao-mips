/// <reference types="cypress" />

const testMip = "32";
const testStatus = 'ACCEPTED';
const regularSearch = "options";
const mipSearch = `MIP${testMip}`;
const dollarSearch = `$ @${testStatus}`;

describe("Search functionality", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("The results of regular search should contain the entered text", () => {
    cy.get("[data-cy=search-input]")
      .click()
      .type(regularSearch)
      .type("{enter}")
      .get("[data-cy=hide-parent-checkbox] label")
      .click();

    cy.get("tr[data-cy=search-result]").each((_, index) => {
      cy.get("tr[data-cy=search-result]")
        .eq(index)
        .click()
        .get("[data-cy=mip-content]")
        .contains(regularSearch, { matchCase: false })
        .should("exist")
        .go("back");
    });

    cy.get("[data-cy=subporposal-item]").each((_, index) => {
      cy.get("[data-cy=subporposal-item]")
        .eq(index)
        .click()
        .get("[data-cy=mip-content]")
        .contains(regularSearch, { matchCase: false })
        .should("exist")
        .go("back");
    });
  });

  it("The hidden parents don't contain the entered text", () => {
    cy.get("[data-cy=search-input]")
      .click()
      .type(regularSearch)
      .type("{enter}")
      .get("[data-cy=hide-parent-checkbox] label")
      .click();

    cy.get("tr[data-cy=hidden-parent] > td:nth-child(2) > a").each((_, index) => {
      cy.get("tr[data-cy=hidden-parent] > td:nth-child(2) > a")
        .eq(index)
        .click({ force: true })
        .get("[data-cy=mip-content]")
        .contains(regularSearch, { matchCase: false })
        .should("not.exist")
        .go("back");
    });
  });

  it("When there are no results for the search, an image should appear that informs it", () => {
    cy.get("[data-cy=search-input]")
      .click()
      .type("text that does not exist{enter}");

    cy.get("[data-cy=no-results-found").should("be.visible");
  });

  it("MIPS Special Search should autocomplete with matching MIPs", () => {
    cy.get("[data-cy=search-input]").click().type(mipSearch).type("{enter}");

    cy.get("tr[data-cy=search-result] td:first-child").each((el) => {
      cy.wrap(el).should("contain.text", testMip);
    });
  });

  it("Dollar single status search", () => {
    cy.get("[data-cy=search-input]")
      .click()
      .type(dollarSearch)
      .type("{enter}")
      .type("{enter}")
      .get("[data-cy=hide-parent-checkbox] label")
      .click();

    cy.get("tr[data-cy=search-result] [data-cy=status]").each(el => {
      cy.wrap(el).should('contain', testStatus);
    })
  })
});
