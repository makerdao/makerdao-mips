/// <reference types="cypress" />

When("Menu {string} is open", (menu) => {
  cy.get("app-nav-menu div").contains(menu).click();
});

When("Mouse goes over submenu dropdown {string}", (subMenu) => {
  cy.get("div.dropdown-content-first-level")
    .contains(subMenu)
    .trigger("mouseover");
});

Then(
  "Corresponding subMenu containing {string} should become visible",
  (contentStr) => {
    contentStr.split(",").forEach((word) => {
      cy.get("div.dropdown-content.fadeInMenuDownAnimation > app-menu")
        .contains(word)
        .should("be.visible");
    });
  }
);

When("Leaf menu item {string} is clicked", (subMenu) => {
  cy.get("div.dropdown-content-first-level").contains(subMenu).click();
  cy.intercept('*').as('anyRequest');
});

When("Leaf subMenu item {string} is clicked",(subMenuItem)=>{
  cy.get("div.dropdown-content.fadeInMenuDownAnimation > app-menu").contains(subMenuItem).click({force:true});
  cy.intercept('*').as('anyRequest');
})

Then("Should visit {string}", (url) => {
  cy.wait('@anyRequest')
  cy.location('href').should("contain", url);
});
