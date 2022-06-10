/// <reference types="cypress" />
describe('Expand and collapse rows', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('When a MIP have components its rows should expand on click on arrow down button', () => {
    cy.get('[data-cy=search-result]').each(($row) => {
      const $btn = $row.find('td:first-child button').get().shift();
      if ($btn) {
        const $expanded = $row.next();

        cy.wrap($btn).click();
        cy.wrap($row).invoke('hasClass', 'maker-expanded-row').should('be.true');
        cy.wrap($expanded).invoke('height').should('be.gt', 2);
        cy.wait(2000);
        cy.wrap($btn).click();
        cy.wrap($row).invoke('hasClass', 'maker-expanded-row').should('be.false');
        cy.wrap($expanded).invoke('height').should('not.be.gt', 2);
      }
    })
  })
})
