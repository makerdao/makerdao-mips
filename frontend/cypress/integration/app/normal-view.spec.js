/// <reference types="cypress" />

function beforeAllTests(cb) {
  beforeEach(() => {
    cy.visit('');
    cy.viewport('macbook-16');

    cb && cb();
  });
}

function runTests(lang = 'en') {
  it('Should have all columns', () => {
    const columns = {
      es: ['#', 'título', 'resumen', 'estado', 'enlaces'],
      en: ['#', 'title', 'summary', 'status', 'links'],
    };

    cy.get('[data-cy=table-list-mips] > thead > tr > th').each(($th, idx) => {
      cy.wrap($th).invoke('text').invoke('trim').should('eq', columns[lang][idx])
    });
  });

  it('Initially should be sorted by #', () => {
    let prevNo = -1;

    cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td:first-child').each(($td, idx) => {
      const curNo = parseInt($td.text().trim());
      cy.wrap(curNo).should('be.gt', prevNo);
      prevNo = curNo;
    })
  });

  it('Testing sorting by Title', () => {
    cy.scrollTo('bottom').wait(1000)
    cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-title .headerContent').click();

    cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-title').then($titles => {
      const titles = $titles.map((_, $title) => $title.textContent.trim()).get();
      cy.wrap(titles).should('deep.equal', titles.slice().sort())
    });

    cy.scrollTo('bottom').wait(1000)

    cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-title .headerContent').click();

    cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-title').then($titles => {
      const titles = $titles.map((_, $title) => $title.textContent.trim()).get();
      cy.wrap(titles).should('deep.equal', titles.slice().sort().reverse())
    });
  })


  it('Testing sorting by Status', () => {
    cy.scrollTo('bottom').wait(1000);

    cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-status .headerContent').click()

    cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-status').then($statuses => {
      const statuses = $statuses.map((_, $status) => $status.textContent.trim()).get();
      cy.wrap(statuses).should('deep.equal', statuses.slice().sort())
    });

    cy.scrollTo('bottom').wait(1000)

    cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-status .headerContent').click();

    cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-status').then($statuses => {
      const statuses = $statuses.map((_, $status) => $status.textContent.trim()).get();
      cy.wrap(statuses).should('deep.equal', statuses.slice().sort().reverse())
    });
  });

  it('Should load more MIPs on scroll to bottom', () => {
    cy.get('tr[data-cy=search-result]').should('have.length', 10);
    cy.get('.loading-plus').should('not.exist');
    cy.scrollTo('bottom').wait(100);
    cy.get('.loading-plus').should('be.visible');
    cy.get('tr[data-cy=search-result]').should('have.length', 20);
    cy.get('.loading-plus').should('not.exist').wait(100);
    cy.scrollTo('bottom');
    cy.get('.loading-plus').should('be.visible');
    cy.get('tr[data-cy=search-result]').should('have.length', 30);
    cy.get('.loading-plus').should('not.exist');
  })
}

describe('Normal View', () => {
  beforeAllTests();
  runTests();
});

describe('Normal View (Dark Mode)', () => {
  beforeAllTests(() => {
    cy.get('div.darkModeToggler').click();
  });

  runTests();
});

describe('Normal View (Spanish)', () => {
  beforeAllTests(() => {
    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(0).click()
  });

  runTests();
});
