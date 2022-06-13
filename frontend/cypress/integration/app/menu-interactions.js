describe('Test Menu Interactions', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it("should render submenus",()=>{
    const menuHeaders =['Learn','Views','Get in Touch'];

   menuHeaders.forEach($header=>{
      cy.visit('')
      cy.get('app-nav-menu div').contains($header).click()
      cy.get('.dropdown-content-first-level').should('be.visible')
      cy.get('.dropdown-content-first-level a').each(($a,$idx)=>{
        cy.get('.dropdown-content-first-level a').eq($idx).click()
        cy.wait(2000)
        cy.visit('')
        cy.get('app-nav-menu div').contains($header).click()
      })
    })
  })
})
