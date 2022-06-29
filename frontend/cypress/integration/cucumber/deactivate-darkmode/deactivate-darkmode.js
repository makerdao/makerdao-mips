Given(/^The user opens the main page$/,()=>{
  cy.visit('')
})

Given(/^Activates darkmode$/, function () {
  cy.get('div.darkModeToggler').click()
});

When(/^The user clicks the darkmode toggler again$/, function () {
  cy.get('div.darkModeToggler').click()
});

Then(/^The main container should NOT use the darkmode classes$/, function () {
  cy.get('.container').should('not.have.class','list-page-container-dark')
});
