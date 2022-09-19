/// <reference types="cypress" />

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
        cy.get('.dropdown-content-first-level a').eq($idx).trigger('mouseover');
        cy.get('.dropdown-content-first-level a').eq($idx).click()
        cy.wait(2000)
        cy.visit('')
        cy.get('app-nav-menu div').contains($header).click()
      })
    })
  })

  it("should render submenus on darkmode",()=>{
    cy.get('div.darkModeToggler').click()

    const menuHeaders =['Learn','Views','Get in Touch'];

    menuHeaders.forEach($header=>{
      cy.visit('')
      cy.get('app-nav-menu div').contains($header).click()
      cy.get('.dropdown-content-first-level').should('be.visible')
      cy.get('.dropdown-content-first-level a').each(($a,$idx)=>{
        cy.get('.dropdown-content-first-level a').eq($idx).trigger('mouseover');
        cy.get('.dropdown-content-first-level a').eq($idx).click()
        cy.wait(2000)
        cy.visit('')
        cy.get('app-nav-menu div').contains($header).click()
      })
    })
  })

  it("should render submenus on spanish",()=>{
    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(0).click()

    cy.wait(2000)

    const menuHeaders =['Aprende','Vistas','Ponte en Contacto'];

    menuHeaders.forEach($header=>{
      cy.visit('')
      cy.get('app-nav-menu div').contains($header).click()
      cy.get('.dropdown-content-first-level').should('be.visible')
      cy.get('.dropdown-content-first-level a').each(($a,$idx)=>{
        cy.get('.dropdown-content-first-level a').eq($idx).trigger('mouseover');
        cy.get('.dropdown-content-first-level a').eq($idx).click()
        cy.wait(2000)
        cy.visit('')
        cy.get('app-nav-menu div').contains($header).click()
      })
    })
  })
})
