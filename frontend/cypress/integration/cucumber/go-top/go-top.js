Given('The user opens the main page',()=>{
  cy.visit('')
})

Then('Go Top component should not be visible',()=>{
  cy.get("[data-cy=button-go-top]").should('not.be.visible');
})

When('Scrolls down 500 pixels', ()=>{
  cy.scrollTo(0, 500);
})

Then('Go Top component should be visible',()=>{
  cy.get("[data-cy=button-go-top]").should('be.visible');
})

When('Clicks Go Top component', ()=>{
  cy.get("[data-cy=button-go-top]").click();
})

When('Scrolls to the top', ()=>{
  cy.scrollTo(0, 0);
})

When('Activates the darkmode',()=>{
  cy.get('div.darkModeToggler').click()
})

When('Activates the spanish language',()=>{
  cy.get('a.language-menu').click()
  cy.get('div.language-menu').find('app-menu').eq(0).click()
})



