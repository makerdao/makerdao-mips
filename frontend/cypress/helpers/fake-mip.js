export function fakeMips() {
  cy.intercept('GET', '**/mips/findall*', { fixture: 'mips.json' }).as('MIPs');
  // TODO find a better way to do this
  cy.intercept('GET', '/mips/findall*', { fixture: 'mips.json' }).as('MIPs');
}
