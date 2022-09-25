Given("The user opens the main page", () => {
  cy.visit("");
});

And("English language is selected", () => {
  cy.get("a.language-menu").click();
  cy.get("div.language-menu").find("app-menu").eq(1).click();
});

When("The user types {string} in the search box", (word) => {
  cy.visit("");
  cy.get("[data-cy=search-input]").type(word);
});

And("Hits Enter", () => {
  cy.intercept("*").as("anyRequest");
  cy.get("[data-cy=search-input]").type("{enter}");
  cy.wait("@anyRequest");
});

Then("The list of MIPs should be visible", () => {
  cy.get("[data-cy=table-list-mips]").should("be.visible");
});

And("The details of each MIP should contain {string}", (word) => {
  const rows = [];

  cy.get("[data-cy=table-list-mips] tr.maker-element-row").each(($row) => {
    cy.wrap($row)
      .find("a")
      .then(($link) => {
        if (Cypress.$($link).hasClass("mipTitleList")) {
          const $href = Cypress.$($link).attr("href");
          rows.push($href);
        }
      });
  });

  cy.wrap(rows).each(($row) => {
    cy.visit($row);
    cy.get(".row.row-tree-column").contains(word, { matchCase: false });
  });
});

When("The user types MIP{string} in the search box", (value) => {
  cy.get("[data-cy=search-input]").clear();
  cy.get("[data-cy=search-input]").type("MIP" + value);
});

Then(
  "The MIPs found should contain the value {string} in its pos column",
  (value) => {
    cy.get(
      "[data-cy=table-list-mips] tr.maker-element-row td.mat-column-pos"
    ).each(($col) => {
      cy.wrap($col)
        .invoke("text")
        .invoke("trim")
        .should(($text) => {
          if ($text !== "" && $text !== "-1") {
            expect($text).to.contain(value);
          }
        });
    });
  }
);
