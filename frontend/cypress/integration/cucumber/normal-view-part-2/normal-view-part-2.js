/// <reference types="Cypress" />
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

When("The user opens all MIPs containing components", () => {
  cy.get("tr[data-cy=search-result]").each((row) => {
    if (row.find(".mat-button-wrapper > .arrow-wrapper").length >= 2) {
      row.find(".mat-button-wrapper > .arrow-wrapper")[0].click();
    }
  });
});

When("The user opens all components containing subproposals", () => {
  cy.get("tr[role=row].maker-element-subset-row").each((component) => {
    if (component.find("div.arrow-wrapper.rotate")) {
      component.click();
    }
  });
});

When("The user clicks the first subproposal in ascendent order", () => {
  let rows = [];
  cy.get("tr[role=row]").each((row) => {
    if (
      row.find("tbody").length === 0 &&
      (row.find("td").length > 1 || row.find("div.arrow-wrapper").length > 0)
    ) {
      rows.push(row);
    }
  });
  cy.wrap(rows).as("elementRows");

  cy.get("@elementRows").then((rows) => {
    let mipIdx = 0;
    let componentIdx = 0;
    let subporposalIdx = 0;

    function isMip(row) {
      return row[0].getAttribute("data-cy") === "search-result";
    }

    function isSubProposal(row) {
      return row[0].getAttribute("data-cy") === "subporposal-row";
    }

    let i = 0;
    for (; i < rows.length; i++) {
      if (isSubProposal(rows[i])) {
        subporposalIdx = i;
        break;
      } else if (isMip(rows[i])) mipIdx = i;
      else componentIdx = i;
    }

    let mipNumber = +rows[mipIdx].find("td")[0].innerText.trim();

    let ct = rows[componentIdx].find("td")[0].innerText.trim();
    let componentNumber = +ct.substring(ct.indexOf("c") + 1, ct.indexOf(":"));

    let subProposalNumber = subporposalIdx - componentIdx;

    cy.wrap(rows[subporposalIdx]).click();
    cy.wrap({ mipNumber, componentNumber, subProposalNumber }).as(
      "subProposalData"
    );
  });
});

Then(
  "The view page corresponding to selected Mip-Component-Subproposal should open",
  () => {
    cy.get("@subProposalData").then(
      ({ subProposalNumber, componentNumber, mipNumber }) => {
        cy.location().then((loc) => {
          cy.wrap(loc.pathname).should(
            "eq",
            `/mips/details/MIP${mipNumber}c${componentNumber}SP${subProposalNumber}`
          );
        });
      }
    );
  }
);

Then(
  "The open page should contain the title corresponding to Mip-Component-Subproposal",
  () =>
    cy
      .get("@subProposalData")
      .then(({ subProposalNumber, componentNumber, mipNumber }) => {
        cy.get("app-detail-content")
          .find("span.title-bold")
          .contains(
            `MIP${mipNumber}c${componentNumber}-SP${subProposalNumber}`
          );
      })
);

When("The user clicks the row corresponding to MIP {string}", (mipNumber) => {
  cy.get("tr[data-cy=search-result]")
    .filter(`:contains(MIP${mipNumber})`)
    .as("targetRow");
  cy.get("@targetRow")
    .find("td")
    .eq(1)
    .invoke("text")
    .then((text) => {
      cy.wrap(text).as("mipTitle"); // title of the mip
    });
  cy.get("@targetRow").click();
});

Then("The view page corresponding to MIP {string} should open", (mipNumber) => {
  cy.location().then((loc) => {
    cy.wrap(loc.pathname).should("eq", `/mips/details/MIP${mipNumber}`);
  });
});

Then("The open page should contain the title of MIP {string}", (mipNumber) => {
  cy.get("@mipTitle").then((title) => {
    const mipName = title;
    console.log(mipName);
    cy.get("app-detail-content").find("span.title").contains(mipName);
  });
});
