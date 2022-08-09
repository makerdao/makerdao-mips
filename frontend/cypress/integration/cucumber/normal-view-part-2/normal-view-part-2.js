// Component opens on MIPS where they are present
Given("The user opens the main page", () => {
  cy.visit("");
});

Given("Dark mode is toggled", () => {
  cy.get("div.darkModeToggler").click();
});

Given("The user selects {string} language", (language) => {
  cy.get("a.language-menu").click();
  cy.get("div.language-menu")
    .find("app-menu")
    .eq(language === "English" ? 1 : 0)
    .click();
  cy.wait(2000);
});

When("The user clicks the row corresponding to MIP {string}", (mipNumber) => {
  cy.get("tr[data-cy=search-result]")
    .filter(`:contains(MIP${mipNumber})`)
    .as("targetRow");
  cy.get("@targetRow")
    .find("td")
    .eq(1)
    .invoke("text")
    .then((text) => {
      cy.wrap(text).as("title"); // title of the mip
    });
  cy.get("@targetRow").click();
});

Then("The view page corresponding to MIP {string} should open", (mipNumber) => {
  cy.location().then((loc) => {
    cy.wrap(loc.pathname).should("eq", `/mips/details/MIP${mipNumber}`);
  });
});

Then("The open page should contain the title of MIP {string}", (mipNumber) => {
  cy.get("@title").then((title) => {
    const mipName = title;
    console.log(mipName);
    cy.get("app-detail-content").find("span.title").contains(mipName);
  });
});

When(
  "The user clicks dropdown icon on the row corresponding to MIP {string}",
  (mipNumber) => {
    cy.get("tr[role=row].maker-element-row")
      .filter(`:contains(MIP${mipNumber})`)
      .find(".mat-button-wrapper > .arrow-wrapper")
      .eq(0)
      .click();
  }
);

Then(
  "The component {string} belonging to MIP {string} should appear in the row right below it",
  (componentNumber, mipNumber) => {
    cy.get("tr[role=row].maker-element-row").each((el, index) => {
      if (el.text().includes(`MIP${mipNumber}`)) {
        cy.get("tr[role=row].maker-detail-row")
          .eq(index)
          .find(`.subsetColumn:contains(MIP${mipNumber}c${componentNumber})`)
          .should("exist");
      }
    });
  }
);

When(
  "The user opens the sub-proposals menu of component {string} of MIP {string}",
  (component, mipNumber) => {
    cy.get("tr[role=row]").each((el, index) => {
      if (el.text().includes(`MIP${mipNumber}`)) {
        cy.get("tr[role=row]")
          .eq(index + 1)
          .find(
            `tr[role=row] > td[role=gridcell]:contains(MIP${mipNumber}c${component})`
          )
          .as("currentComponent");
        cy.get("@currentComponent")
          .find("div.arrow-wrapper")
          .invoke("attr", "class")
          .then((classes) => {
            if (classes.indexOf("rotated") === -1)
              // make sure it's not already open
              cy.get("@currentComponent").click();
          });
      }
    });
  }
);

Then(
  "The list of subproposals belonging to component {string} of MIP {string} should appear in the row right below it",
  (componentNumber, mipNumber) => {
    cy.get("tr[data-cy=search-result].maker-element-row").each((el, index) => {
      if (el.text().includes(`MIP${mipNumber}`)) {
        cy.get("tr[role=row].maker-detail-row").eq(index).as("componentList");
        cy.get("@componentList")
          .find("tr[role=row].maker-element-subset-row > .subsetColumn")
          .each((component, componentIndex) => {
            if (
              component.text().includes(`MIP${mipNumber}c${componentNumber}`)
            ) {
              cy.get("@componentList")
                .find("tr[role=row].maker-detail-subset-row")
                .eq(componentIndex)
                .find("app-list-subproposal")
                .should("exist");
            }
          });
      }
    });
  }
);

When(
  "The user clicks on subproposal {string} of component {string} of MIP {string}",
  (subproposalNumber, componentNumber, mipNumber) => {
    cy.get("tr[data-cy=subporposal-row]")
      .contains(`MIP${mipNumber}c${componentNumber}-SP${subproposalNumber}`)
      .click();
  }
);

Then(
  "The view page corresponding to subproposal {string} of component {string} of MIP {string} should open",
  (subproposalNumber, componentNumber, mipNumber) => {
    cy.location().then((loc) => {
      cy.wrap(loc.pathname).should(
        "eq",
        `/mips/details/MIP${mipNumber}c${componentNumber}SP${subproposalNumber}`
      );
    });
  }
);

Then(
  "The open page should contain the name of the sproposal {string} of component {string} of MIP {string} as main header",
  (subproposalNumber, componentNumber, mipNumber) => {
    cy.get("app-detail-content")
      .find("span.title-bold")
      .contains(`MIP${mipNumber}c${componentNumber}-SP${subproposalNumber}`);
  }
);
