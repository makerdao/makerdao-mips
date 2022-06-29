Given('The user opens the main page',()=>{
  cy.visit('')
})

When('The user types \'proposal\' in the search box',()=>{
  cy.get('[data-cy=search-input]').type('proposal')
})

And('Hits Enter',()=>{
  cy.get('[data-cy=search-input]').type('{enter}')
})

Then('The list of MIPs should be visible',()=>{
  cy.get('[data-cy=table-list-mips]').should('be.visible')
})

And('The details of each MIP should contain \'proposal\'',()=>{
  const rows = []

  cy.get('[data-cy=table-list-mips] tr.maker-element-row').each(($row) => {

    cy.wrap($row).find("a").then($link => {
      if (Cypress.$($link).hasClass('mipTitleList')) {
        const $href = Cypress.$($link).attr("href");
        rows.push($href);
      }
    });
  });

  cy.wrap(rows).each($row => {
    cy.visit($row);
    cy.get(".row.row-tree-column").contains('proposal',{matchCase:false});
  });
})
