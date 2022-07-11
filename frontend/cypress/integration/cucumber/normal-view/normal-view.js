Given('The user opens the main page',()=>{
  cy.visit('')
})

Given('The user selects English language',()=>{
  cy.get('a.language-menu').click()
  cy.get('div.language-menu').find('app-menu').eq(1).click()
  cy.wait(2000)
})

Then('The MIps list should have the given columns in English',()=>{
  const columns = ['#', 'title', 'summary', 'status', 'links'];

  cy.get('[data-cy=table-list-mips] > thead > tr > th').each(($th, idx) => {
    cy.wrap($th).invoke('text').invoke('trim').should('eq', columns[idx])
  });
})

Given('The user selects Spanish language',()=>{
  cy.get('a.language-menu').click()
  cy.get('div.language-menu').find('app-menu').eq(0).click()
  cy.wait(2000)
})

Then('The MIps list should have the given columns in Spanish',()=>{
  const columns = ['#', 'título', 'resumen', 'estado', 'enlaces']

  cy.get('[data-cy=table-list-mips] > thead > tr > th').each(($th, idx) => {
    cy.wrap($th).invoke('text').invoke('trim').should('eq', columns[idx])
  });
})


Then('The MIPs list should be sorted by #',()=>{
  let prevNo = -1;

  cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td:first-child').each(($td, idx) => {
    const curNo = parseInt($td.text().trim());
    cy.wrap(curNo).should('be.gt', prevNo);
    prevNo = curNo;
  })
})


When('The user clicks the title column header',()=>{
  cy.scrollTo('bottom').wait(1000)
  cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-title .headerContent').click();
})

Then('The MIps list should be sorted by title ascending',()=>{
  cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-title').then($titles => {
    console.log($titles);
    const titles = $titles.map((_, $title) => $title.textContent.trim()).get();
    console.log(titles);
    cy.wrap(titles).should('deep.equal', titles.slice().sort())
  });
})

When('The user clicks the title column header again',()=>{
  cy.scrollTo('bottom').wait(1000)
  cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-title .headerContent').click();
})

Then('The MIps list should be sorted by title descending',()=>{
  cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-title').then($titles => {
    const titles = $titles.map((_, $title) => $title.textContent.trim()).get();
    cy.wrap(titles).should('deep.equal', titles.slice().sort().reverse())
  });
})

When('The user clicks the status column header',()=>{
  cy.scrollTo('bottom').wait(1000)
  cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-status .headerContent').click();
})

Then('The MIps list should be sorted by status ascending',()=>{
  cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-status').then($statuses => {
    const statuses = $statuses.map((_, $status) => $status.textContent.trim()).get();
    cy.wrap(statuses).should('deep.equal', statuses.slice().sort())
  });
})

When('The user clicks the status column header again',()=>{
  cy.scrollTo('bottom').wait(1000)
  cy.get('[data-cy=table-list-mips] > thead > tr > th.mat-column-status .headerContent').click();
})

Then('The MIps list should be sorted by status descending',()=>{
  cy.get('[data-cy=table-list-mips] > tbody > tr[data-cy=search-result] > td.mat-column-status').then($statuses => {
    const statuses = $statuses.map((_, $status) => $status.textContent.trim()).get();
    cy.wrap(statuses).should('deep.equal', statuses.slice().sort().reverse())
  });
})

Then('The MIps list should have length 10',()=>{
  cy.get('tr[data-cy=search-result]').should('have.length', 10);
})

Then('Loading plus component should not exist',()=>{
  cy.get('.loading-plus').should('not.exist');
})

When('The user scrolls to the bottom',()=>{
  cy.scrollTo('bottom').wait(100);
})

Then('Loading plus component should be visible',()=>{
  cy.get('.loading-plus').should('be.visible');
})

And('The MIPs list should have length 20',()=>{
  cy.get('tr[data-cy=search-result]').should('have.length', 20);
})

And('Loading plus component should not exist',()=>{
  cy.get('.loading-plus').should('not.exist').wait(100);
})

And('The MIPs list should have length 30',()=>{
  cy.get('tr[data-cy=search-result]').should('have.length', 30);
})





