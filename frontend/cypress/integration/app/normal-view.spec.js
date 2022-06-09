/// <reference types="cypress" />

describe('Normal View', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('Should have all columns', () => {
    const columns = ['#', 'title', 'summary', 'status', 'links'];

    cy.get('[data-cy=table-list-mips] > thead > tr > th').each(($th, idx) => {
      cy.wrap($th).invoke('text').invoke('trim').should('eq', columns[idx])
    })
  });

  it('Initially should be sorted by #', () => {
    let prevNo = -1;

    cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td:first-child').each(($td, idx) => {
      const curNo = parseInt($td.text().trim());
      cy.wrap(curNo).should('be.gt', prevNo);
      prevNo = curNo;
    })
  });
});
