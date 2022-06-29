Given('The user opens the main page',()=>{
    cy.visit('')
})

When ('The user clicks the darkmode toggler',()=> {
  cy.get('div.darkModeToggler').click()
})

Then('The main container should use the darkmode classes',()=>{
  cy.get('.container.list-page-container-dark').should('be.visible')
})



