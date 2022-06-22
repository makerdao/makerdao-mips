/// <reference types="cypress" />

const mipsets = [
  'collateral-onboarding-mipset',
  'core-governance-mipset',
  'core-unit-framework-mipset'
];

const columns = ['pos', 'title', 'summary', 'status', 'link'];
const columnsHeadersSpanish = ['#', 'título', 'resumen', 'estado', 'enlaces'];
const columnsHeadersEnglish = ['#', 'title', 'summary', 'status', 'links']


function beforeAllTests(cb) {
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

    cb && cb();
  });
}

function runTests(language) {
  it('All three rows of mispets are shown', () => {
    cy.wait(400)
    mipsets.forEach(mipset => {
      cy.get(`[data-cy=mipset-row-${mipset}]`)
        .should('exist')
        .invoke('hasClass', 'maker-expanded-row')
        .should('be.false');

      cy.wait(700);


      cy.get(`[data-cy=mipset-row-${mipset}]`).click();

      cy.wait(700);

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

      cy.get('.mat-table thead > tr > th').each(($th,$idx)=>{
          cy.wrap($th).invoke('text').should('contain',language === 'en' ? columnsHeadersEnglish[$idx]:columnsHeadersSpanish[$idx])
      })
    });
  });
}

describe('MIP Sets View', () => {
  beforeAllTests();
  runTests('en');
});

describe('MIP Sets View (Spanish)', () => {
  beforeAllTests(() => {
    cy.get('a.language-menu').click();

    cy.get('div.language-menu').find('app-menu').eq(0).click();
  });
  runTests('es');
});
