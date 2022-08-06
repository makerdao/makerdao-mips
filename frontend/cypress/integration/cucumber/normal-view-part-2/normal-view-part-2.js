
// Component opens on MIPS where they are present
Given("The user opens the main page", () => {
  cy.visit("");
});

And("Dark mode is toggled", () => {
  cy.get("div.darkModeToggler").click();
});

And("The user selects {string} language", (language) => {
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

And("The open page should contain the title of MIP {string}", (mipNumber) => {
  cy.get("@title").then((title) => {
    const mipName = title;
    console.log(mipName);
    cy.get("app-detail-content").find("span.title").contains(mipName);
  });
});

// Component opens on MIPS where they are present

// Given("The user opens the main page", () => {
//   cy.visit("");
// });

// When("The user clicks the row corresponding to MIP {string}", (mipNumber) => {
//   cy.get("tr[data-cy=search-result]")
//     .filter(`:contains(MIP${mipNumber})`)
//     .as("targetRow");
//   cy.get("@targetRow")
//     .find("td")
//     .eq(1)
//     .invoke("text")
//     .then((text) => {
//       cy.wrap(text).as("title"); // title of the mip
//     });
//   cy.get("@targetRow").click();
// });

// Then("The view page corresponding to MIP {string} should open", (mipNumber) => {
//   cy.location().then((loc) => {
//     cy.wrap(loc.pathname).should("eq", `/mips/details/MIP${mipNumber}`);
//   });
// });

// And("The open page should contain the title of MIP {string}", (mipNumber) => {
//   cy.get("@title").then((title) => {
//     const mipName = title;
//     console.log(mipName);
//     cy.get("app-detail-content").find("span.title").contains(mipName);
//   });
// });

// When(
//   "The user clicks dropdown icon on the row corresponding to MIP {string}",
//   () => {
//     cy.get("tr[data-cy=search-result]")
//       .filter(`:contains(MIP${mipNumber})`)
//       .find(".mat-button-wrapper > .arrow-wrapper")
//       .click();
//   }
// );

// Then("The components belonging to MIP {string} should appear", (mipNumber) => {
//   cy.get("tr[role=row]").each((el, index) => {
//     if (el.contains(`MIP${mipNumber}`))
//       cy.wrap(index).as("mipComponentContainerIndex");
//   });
//   cy.get("tr[role=row]")
//     .eq(cy.get("@mipComponentContainerIndex"))
//     .invoke("attr", "data-cy")
//     .should("not.equal", "search-result");
// });

// When(
//   "The user opens the sub-proposals menu of component {string} of MIP {string}",
//   (component, mipNumber) => {
//     cy.get("tr[role=row]").each((el, index) => {
//       if (el.contains(`MIP${mipNumber}`))
//         cy.wrap(index).as("mipComponentContainerIndex");
//     });
//     cy.get("tr[role=row]")
//       .eq(cy.get("@mipComponentContainerIndex"))
//       .find(`:contains(${component})`)
//       .as("currentComponent");
//     cy.get("@currentComponent").then((mipComponent) => {
//       mipComponent
//         .find(".mat-button-wrapper > .arrow-wrapper > span > div")
//         .invoke("attr", "class")
//         .then((classes) => {
//           if (classes.indexOf("rotated") === -1)
//             cy.get("@currentComponent").click();
//         });
//     });
//   }
// );

// Then(
//   "The sub-proposals of component {string} of MIP {string} should appear",
//   () => {}
// );
