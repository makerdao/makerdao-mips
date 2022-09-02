/// <reference types="cypress" />

describe("Normal List View", () => {
  before(() => {
    const search = {
      customViewName: 'Dai Foundation Core Unit (DAIF-001) Subproposals',
      '_Active Subproposals': '$AND(#active,#cu-daif-001)',
      _Archive: '$AND(NOT(#active),#cu-daif-001)',
      shouldBeExpandedMultiQuery: 'true',
      hideParents: 'false',
    };
    const params = new URLSearchParams(search);
    const url = `/mips/list?${params.toString()}`;
    cy.viewport(1536, 600);
    cy.visit(url);
  });

  it('Entire View', () => {
    Cypress.$('app-button-top').remove();
    cy.testScreenshot(null, 'multi-queries-view/entire-view');
  });

  it('Title', () => {
    cy.get('app-list-page .container').first().then($el => {
      cy.testScreenshot($el, 'multi-queries-view/title')
    })
  });

  it('Table', () => {
    cy.get('table').first().then($el => {
      cy.testScreenshot($el, 'multi-queries-view/table')
    })
  });

});
