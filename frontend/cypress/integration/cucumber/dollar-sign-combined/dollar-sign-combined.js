Given('The user opens the main page',()=>{
  cy.visit('')
})


When('Types ACCEPTED,OBSOLETE in the search bar plus Enter',()=>{
  const valueOne = '$OR(@ACCEPTED,@OBSOLETE)';

  cy.get('[data-cy=search-input]').clear()
  cy.get('[data-cy=search-input]').type(valueOne)
  cy.get('[data-cy=search-input]').type('{enter}')
})

Then('The found MIps should have the statuses either ACCEPTED or OBSOLETE',()=>{
  const expressionRegexOne = /(ACCEPTED|OBSOLETE)/i

  cy.get('[data-cy=table-list-mips] tr.maker-element-row:not(.maker-expanded-row) td.mat-column-status').each(($row) => {
    cy.wrap($row).invoke('text').should('match', expressionRegexOne);
  })
})

When('Types RFC,OBSOLETE in the search bar plus Enter',()=>{
  const valueTwo = '$OR(@RFC,@OBSOLETE)';

  cy.get('[data-cy=search-input]').clear()
  cy.get('[data-cy=search-input]').type(valueTwo)
  cy.get('[data-cy=search-input]').type('{enter}')
})


Then('The found MIps should have the statuses either RFC or OBSOLETE',()=>{
  const expressionRegexTwo = /(RFC|OBSOLETE)/i

  cy.get('[data-cy=table-list-mips] tr.maker-element-row:not(.maker-expanded-row) td.mat-column-status').each(($row) => {
    cy.wrap($row).invoke('text').should('match', expressionRegexTwo);
  })
})


When('Types the tags collateral-onboarding, mip-set combined with AND in the search bar plus Enter',()=>{
  const dataset = ['collateral-onboarding', 'mip-set'];
  const query = `$ AND(${dataset.map(tag => `#${tag}`).join(',')})`;
  cy.get('[data-cy=search-input]').clear().type(query).type('{esc}{enter}{enter}');
})

Then('The found MIps should have the tags collateral-onboarding, mip-set',()=>{
  const dataset = ['collateral-onboarding', 'mip-set'];

  cy.get('body').then($body => {
    if ($body.find('tr[data-cy=search-result], tr[data-cy=subporposal-row]')?.length) {
      cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').each((_, idx) => {
        cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').eq(idx).click();
        for(const tag of dataset) {
          cy.get('[data-cy=details-tags]').should('contain', tag);
        }
        cy.go('back');
      });
    }
  })
})


When('Types the tags with core unit, facilitator, personnel-xboarding AND in the search bar plus Enter',()=>{
  const datasetTwo= ['core unit', 'facilitator', 'personnel-xboarding']
  const query = `$ AND(${datasetTwo.map(tag => `#${tag}`).join(',')})`;
  cy.get('[data-cy=search-input]').clear().type(query).type('{esc}{enter}{enter}');
})

Then('The found MIps should have the tags core unit, facilitator, personnel-xboarding',()=>{
  const datasetTwo= ['core unit', 'facilitator', 'personnel-xboarding']

  cy.get('body').then($body => {
    if ($body.find('tr[data-cy=search-result], tr[data-cy=subporposal-row]')?.length) {
      cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').each((_, idx) => {
        cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').eq(idx).click();
        for(const tag of datasetTwo) {
          cy.get('[data-cy=details-tags]').should('contain', tag);
        }
        cy.go('back');
      });
    }
  })
})

