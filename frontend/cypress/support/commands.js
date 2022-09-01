import { addMatchImageSnapshotCommand } from "cypress-image-snapshot/command";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

addMatchImageSnapshotCommand();

Cypress.Commands.add("testScreenshot", (selector, image, timeout = 1000) => {
  if (!selector) {
    cy.then(($all) => {
      cy.wait(timeout);
      cy.wrap($all).matchImageSnapshot(image);
    });
  } else if (typeof selector === "string") {
    cy.get(selector).then(($el) => {
      cy.wait(timeout);
      cy.wrap($el).scrollIntoView().matchImageSnapshot(image);
    });
  } else {
    cy.wait(timeout);
    cy.wrap(selector).scrollIntoView().matchImageSnapshot(image);
  }
});

Cypress.Commands.add("forEach", (selector, cb) => {
  cy.get(selector).each((_, idx) => {
    cy.get(selector)
      .eq(idx)
      .then(($el) => {
        cb && cb($el, idx);
      });
  });
});
