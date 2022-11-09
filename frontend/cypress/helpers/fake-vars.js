export function fakeVars(lang = 'en', value) {
  let fixture = 'vars.yaml';

  if (lang !== 'en') {
    fixture = `vars-${lang}.yaml`;
  }

  cy.intercept('GET', '**/meta/vars.yaml*', { fixture }).as('Vars');
}
