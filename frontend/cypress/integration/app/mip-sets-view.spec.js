/// <reference types="cypress" />

const mipsets = [
  'collateral-onboarding-mipset',
  'core-governance-mipset',
  'core-unit-framework-mipset'
];

const columns = ['pos', 'title', 'summary', 'status', 'link'];

describe('MIP Sets View', () => {
  beforeEach(() => {
    cy.visit('');

    cy.get('[data-cy=menu-views]')
      .click()
      .get('[data-cy=menu-mipsets]')
      .click();

    cy.wait(2000);
    cy.window().then(win => {
      const url = `${win.location.pathname}${win.location.search}${win.location.hash}`;
      cy.visit(url);
    });

  });

  it('All three rows of mispets are shown', () => {
    mipsets.forEach(mipset => {
      cy.get(`[data-cy=mipset-row-${mipset}]`)
        .should('exist')
        .invoke('hasClass', 'maker-expanded-row')
        .should('be.false');

      cy.wait(500);


      cy.get(`[data-cy=mipset-row-${mipset}]`).click();

      cy.wait(100);

      cy.get(`[data-cy=mipset-row-${mipset}]`)
        .invoke('hasClass', 'maker-expanded-row')
        .should('be.true');

      cy.get(`[data-cy=mipset-row-${mipset}]`).then($row => {
        cy.wrap($row.next()).find('tbody > tr.maker-element-row').then($tr => {
          columns.forEach(col => {
            cy.wrap($tr.children(`.mat-column-${col}`)).should('exist');
          })
        })
      });
    });
  });
});
