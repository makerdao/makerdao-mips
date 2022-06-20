export function fakeMips() {
  cy.intercept('GET', '**/mips/findall*', { fixture: 'mips.json' }).as('MIPs');
}
