/// <reference types="cypress" />

const { fakeMenu } = require("../../helpers/fake-menu");
const { fakeMips } = require("../../helpers/fake-mips");
const { fakeNews } = require("../../helpers/fake-news");
const { fakeVars } = require("../../helpers/fake-vars");


describe('Normal List View', () => {
  before(() => {
    fakeVars();
    fakeNews();
    fakeMips();
    fakeMenu();
    cy.viewport(1536, 600);
    cy.visit('');
  });

  it('Entire View', () => {
    Cypress.$('app-button-top').remove();
    cy.testScreenshot(null, 'normal-view/entire-view');
  });

  it('Table', () => {
    cy.testScreenshot('[data-cy=table-list-mips]', 'normal-view/mips-table');
  });

  it('Headers', () => {
    cy.get('[data-cy=table-list-mips] thead tr').first().then($el => {
      cy.testScreenshot($el, 'normal-view/mip-row-header')
    });
  });

  it('Row', () => {
    cy.get('[data-cy=table-list-mips] tbody tr').first().then($el => {
      cy.testScreenshot($el, 'normal-view/mip-row');
    });
  });

  it('MIP description', () => {
    cy.get('[data-cy=table-list-mips] tbody tr').first().then($tr => {
      cy.wrap($tr).find('td.mat-column-summary button').click();
      cy.testScreenshot($tr, 'normal-view/mip-row-with-expanded-description');
      cy.wrap($tr).find('td.mat-column-summary button').click();
    })
  });

  it('MIP components', () => {
    cy.get('[data-cy=table-list-mips] tbody tr').eq(4).then($tr => {
      cy.wrap($tr).find('td:first-child button').click();
      cy.testScreenshot($tr.next(), 'normal-view/mip-row-with-expanded-components');
    })
  });
});
