export function fakeMip() {
  cy.intercept('GET', '**/mips/findone*', { fixture: 'mip.json' }).as('MIP');
}
