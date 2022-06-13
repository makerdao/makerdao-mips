Cypress.Commands.add("forceVisit",url=>{
  cy.window().then(win=>{
    return win.open(url,"_self")
  })
})

describe('Test Regular Search', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it("should render submenus",()=>{
    const menuHeaders =['Learn','Views','Get in Touch'];

   menuHeaders.forEach($menu=>{
      cy.visit('')
      cy.get('div').contains($menu).click()
      cy.get('.dropdown-content-first-level').should('be.visible')
      cy.get('.dropdown-content-first-level a').each(($a,$idx)=>{
        cy.get('.dropdown-content-first-level a').eq($idx).click()
        cy.wait(2000)
        cy.visit('')
        cy.get('div').contains($menu).click()
      })
    })
  })
})
