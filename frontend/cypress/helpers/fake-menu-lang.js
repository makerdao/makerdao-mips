export function fakeMenuLang() {
  cy.intercept("GET", "**/menuLang.json*", { fixture: "menuLang.json" }).as(
    "MenuLang"
  );
}
