const mipsets = ['collateral-onboarding-mipset',
  'core-governance-mipset',
  'core-unit-framework-mipset'];
const columns = ['pos', 'title', 'summary', 'status', 'link'];
const columnsHeadersSpanish = ['#', 'título', 'resumen', 'estado', 'enlaces'];
const columnsHeadersEnglish = ['#', 'title', 'summary', 'status', 'links']

Given('The user opens the main page',()=>{
  cy.visit('')
})

When('The user clicks the menu option for MIP Sets',()=>{
  cy.get('[data-cy=menu-views]')
    .click()
    .get('[data-cy=menu-mipsets]')
    .click();

  cy.wait(2000);
  cy.window().then(win => {
    const url = `${win.location.pathname}${win.location.search}${win.location.hash}`;
    cy.visit(url);
  });
})

Then('The view should contain the three groupings with the given columns',()=>{
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
  });
})

And('The headings of the columns should match in English',()=>{
  mipsets.forEach(mipset => {

    cy.get('.mat-table thead > tr > th').each(($th,$idx)=>{
      cy.wrap($th).invoke('text').should('contain',columnsHeadersEnglish[$idx])
    })
  });
})

And('The headings of the columns should match in Spanish',()=>{
  mipsets.forEach(mipset => {

    cy.get('.mat-table thead > tr > th').each(($th,$idx)=>{
      cy.wrap($th).invoke('text').should('contain',columnsHeadersSpanish[$idx])
    })
  });
})

And('The user selects English language',()=>{
  cy.get('a.language-menu').click();
  cy.get('div.language-menu').find('app-menu').eq(1).click();
  cy.wait(2000);
})

And('The user selects Spanish language',()=>{
  cy.get('a.language-menu').click();
  cy.get('div.language-menu').find('app-menu').eq(0).click();
  cy.wait(2000);
})

