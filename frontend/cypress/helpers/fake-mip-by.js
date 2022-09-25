export function fakeMipBy() {
  cy.intercept('GET', '**/mips/findone-by*', { fixture: 'mip9-by.json' }).as('MIP-by');
}
