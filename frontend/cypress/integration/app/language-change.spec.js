describe('Test Language Change', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('should change language when clicking the switcher',()=>{
    cy.visit('')
    cy.get('app-list').contains('TITLE',{matchCase:false})
    cy.get('app-list').contains('SUMMARY',{matchCase:false})
    cy.get('app-list').contains('STATUS',{matchCase:false})
    cy.get('app-list').contains('LINKS',{matchCase:false})


    let menuHeaders =['Learn','Views','Get in Touch']

    let subMenus = new Array(3);
    subMenus[0] = ['Primer for Authors','The MIPs Framework','Monthly Governance Cycle']
    subMenus[1] = ['Status','Core Units','MIP Sets','Living MIPs','Technical','Processes']
    subMenus[2] = ['Forum','Chat']

    menuHeaders.forEach(($header,$indexHeader)=>{
      cy.visit('')
      cy.get('app-nav-menu div').contains($header).click()
      cy.get('.dropdown-content-first-level').should('be.visible')
      cy.get('.dropdown-content-first-level a').each(($a,$idx)=>{
        cy.wrap($a).contains(subMenus[$indexHeader][$idx])
      })
    })

    cy.visit('')
    cy.get('a.language-menu').click()

    cy.get('div.language-menu').find('app-menu').eq(0).click()
    cy.get('app-list').contains('TÍTULO',{matchCase:false})
    cy.get('app-list').contains('resumen',{matchCase:false})
    cy.get('app-list').contains('estado',{matchCase:false})
    cy.get('app-list').contains('enlaces',{matchCase:false})

    let menuHeadersSpanish =['Aprende','Vistas','Ponte en Contacto']

    let subMenusSpanish = new Array(3);
    subMenusSpanish[0] = ['Intro para Autores','El Framework de MIP','Ciclo de Gobernanza Mensual']
    subMenusSpanish[1] = ['Estado','Core Units','MIP Sets','Propuestas Registrales','Técnicas','Procesos']
    subMenusSpanish[2] = ['Foro','Chat']

    menuHeadersSpanish.forEach(($header,$indexHeader)=>{
      cy.visit('')
        cy.get('app-nav-menu div').contains($header).click()
      cy.get('.dropdown-content-first-level').should('be.visible')
      cy.get('.dropdown-content-first-level a').each(($a,$idx)=>{
        cy.wrap($a).contains(subMenusSpanish[$indexHeader][$idx])
      })
    })




  })
})
