export function fakeMenu(lang = 'en') {
  let fixture = 'menu.yaml';

  if (lang !== 'en') {
    fixture = `menu-${lang}.yaml`;
  }

  cy.intercept('GET', '**/mips/master/meta/menu.yaml*', { fixture }).as('Menu');
}
