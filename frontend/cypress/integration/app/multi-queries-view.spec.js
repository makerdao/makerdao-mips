/// <reference types="cypress" />

describe('Multi Queries View', () => {
  before(() => {
    cy.visit('');
    cy.get('[data-cy=menu-views]').click();
    cy.get('[data-cy=menu-coreunits]').click();
    cy.get('[data-cy=menu-daif-001]').first().click();

    cy.wait(500);

    cy.location().then(loc => {
      const url = `${loc.pathname}${loc.search}${loc.hash}`;
      cy.visit(url);
    });
  });

  it('Title should be specific core unit + Sub-proposal', () => {
    cy.location().then(loc => {
      const search = new URLSearchParams(loc.search);

      const viewName = search.get('customViewName');

      cy.get('[data-cy=title').invoke('text').invoke('trim').should('eq', viewName);
    })
  });

  it('Both groups must exist', () => {
    cy.get('[data-cy=multiqueries-row]').each(($row, idx) => {
      if (idx === 0) {
        cy.wrap($row).should('contain', 'Active Subproposals');
      } else {
        cy.wrap($row).should('contain', 'Archive');
      }
    })
  })

  it('Query params must be present in the url', () => {
    cy.location().then(loc => {
      const search = new URLSearchParams(loc.search);
      const hideParents = search.get('hideParents');
      const expandedDetails = search.get('shouldBeExpandedMultiQuery');

      cy.wrap(!!hideParents).should('be.true');
      cy.wrap(!!expandedDetails).should('be.true');
    });
  });

  it('All columns must be visible', () => {
    const columns = ['pos', 'title', 'summary', 'status', 'links'];

    cy.get('tr.maker-element-row').first().then($row => {
      columns.forEach(col => {
        cy.wrap($row).find(`td.mat-column-${col}`).should('exist');
      });
    });
  });
});
