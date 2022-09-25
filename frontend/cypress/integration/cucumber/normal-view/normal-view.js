Given("The user opens the main page", () => {
  cy.visit("");
});

Given("The user selects English language", () => {
  cy.get("a.language-menu").click();
  cy.get("div.language-menu").find("app-menu").eq(1).click();
  cy.wait(2000);
});

Then("The MIps list should have the given columns in English", () => {
  const columns = ["#", "title", "summary", "status", "links"];

  cy.get("[data-cy=table-list-mips] > thead > tr > th").each(($th, idx) => {
    cy.wrap($th).invoke("text").invoke("trim").should("eq", columns[idx]);
  });
});

Given("The user selects Spanish language", () => {
  cy.get("a.language-menu").click();
  cy.get("div.language-menu").find("app-menu").eq(0).click();
  cy.wait(2000);
});

Then("The MIps list should have the given columns in Spanish", () => {
  const columns = ["#", "título", "resumen", "estado", "enlaces"];

  cy.get("[data-cy=table-list-mips] > thead > tr > th").each(($th, idx) => {
    cy.wrap($th).invoke("text").invoke("trim").should("eq", columns[idx]);
  });
});

Then("The MIPs list should be sorted by #", () => {
  let prevNo = -1;

  cy.get(
    "[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td:first-child"
  ).each(($td, idx) => {
    const curNo = parseInt($td.text().trim());
    cy.wrap(curNo).should("be.gt", prevNo);
    prevNo = curNo;
  });
});

When("The user clicks the title column header", () => {
  cy.intercept("**/mips/findall*").as("sortRequest");
  cy.scrollTo("bottom");
  cy.get(
    "[data-cy=table-list-mips] > thead > tr > th.mat-column-title .headerContent"
  ).click();
  cy.wait("@sortRequest");
  cy.get("div.maker-loading-shade").should("not.exist");
});


When("The user clicks the title column header again", () => {
  cy.scrollTo("bottom");
  cy.get(
    "[data-cy=table-list-mips] > thead > tr > th.mat-column-title .headerContent"
  ).click();
  cy.get("div.maker-loading-shade ng-star-inserted").should("not.exist");
});

When("The user clicks the status column header", () => {
  cy.scrollTo("bottom");
  cy.get(
    "[data-cy=table-list-mips] > thead > tr > th.mat-column-status .headerContent"
  ).click();
  cy.wait("@MIPs");
});

Then(
  "The MIps list should be sorted by {string} {string}",
  (criteria, order) => {
    let str = `order=${order === "descending" ? "-" : ""}${criteria}`;
    cy.get("@MIPs").then((req) => {
      cy.wrap(req.request.url).should("include", str);
    });
  }
);

When("The user clicks the status column header again", () => {
  cy.scrollTo("bottom");
  cy.get(
    "[data-cy=table-list-mips] > thead > tr > th.mat-column-status .headerContent"
  ).click();
});


Then("The MIPs list should have length {string}", (length) => {
  cy.get("tr[data-cy=search-result]").should("have.length", +length);
});

Then("Loading plus component should not exist", () => {
  cy.get(".loading-plus").should("not.exist");
});

When("The user scrolls to the bottom", () => {
  cy.scrollTo("bottom");
});

Then("Loading plus component should be visible", () => {
  cy.get(".loading-plus").should("be.visible");
});

Then("Loading plus component should appear for a moment", () => {
  cy.get(".loading-plus").should("be.visible");
  cy.get(".loading-plus").should("not.exist");
});

And("Loading plus component should not exist", () => {
  cy.get(".loading-plus").should("not.exist");
});
