Given('The user opens the main page',()=>{
  cy.visit('')
})

Given("Dark mode is toggled", () => {
  cy.get("div.darkModeToggler").click();
});

Given("The user selects {string} language", (language) => {
  cy.get("a.language-menu").click();
  cy.get("div.language-menu")
    .find("app-menu")
    .eq(language === "English" ? 1 : 0)
    .click();
  cy.wait(2000);
});

When('The user clicks the menu option for Core Unit',()=>{
  cy.get('[data-cy=menu-views]').click();
  cy.get('[data-cy=menu-coreunits]').click();
  cy.get('[data-cy=menu-daif-001]').first().click();

  cy.wait(500);

  cy.location().then(loc => {
    const url = `${loc.pathname}${loc.search}${loc.hash}`;
    cy.visit(url);
  });
})



Then('The title header should match the customViewName param in the URL',()=>{
  cy.location().then(loc => {
    const search = new URLSearchParams(loc.search);
    const viewName = search.get('customViewName');
    cy.get('[data-cy=title').invoke('text').invoke('trim').should('eq', viewName);
  })
})

Then('Both groups must exist',()=>{
  cy.get('[data-cy=multiqueries-row]').each(($row, idx) => {
    if (idx === 0) {
      cy.wrap($row).should('contain', 'Active Subproposals');
    } else {
      cy.wrap($row).should('contain', 'Archive');
    }
  })
})

Then('Query params must exist in the URL',()=>{
  cy.location().then(loc => {
    const search = new URLSearchParams(loc.search);
    const hideParents = search.get('hideParents');
    const expandedDetails = search.get('shouldBeExpandedMultiQuery');

    cy.wrap(!!hideParents).should('be.true');
    cy.wrap(!!expandedDetails).should('be.true');
  });
})

Then('All columns must be visible',()=>{
  const columns = ['pos', 'title', 'summary', 'status', 'links'];

  cy.get('tr.maker-element-row').first().then($row => {
    columns.forEach(col => {
      cy.wrap($row).find(`td.mat-column-${col}`).should('exist');
    });
  });
})
