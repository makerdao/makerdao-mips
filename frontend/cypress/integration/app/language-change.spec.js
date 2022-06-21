describe('Test Language Change', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('should change language when clicking the switcher (home page)',()=>{
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

  it('should change language when clicking the switcher (home page, darkmode)',()=>{
    cy.visit('')
    cy.get('div.darkModeToggler').click()
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

  it('should change language when clicking the switcher (MIP details page)',()=>{
    cy.visit('/mips/details/MIP1')
    cy.get('app-proposal-components').contains('Contents',{matchCase:false})

    cy.get('.sidebar-wrapper').contains('Languages',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Details',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Title',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Status',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Tags',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Date Proposed',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Date Ratified',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Author',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Contributor',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Dependencies',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Replaces',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Type',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('References',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Recent Changes',{matchCase:false})

    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(0).click()

    cy.get('app-proposal-components').contains('Contenido',{matchCase:false})

    cy.get('.sidebar-wrapper').contains('Idiomas',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Detalles',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Título',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Estatus',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Etiquetas',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Fecha propuesta',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Fecha de ratificación',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Autor',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Contribuyente',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Dependencias',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Replaces',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Tipo',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Referencias',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Cambios Recientes',{matchCase:false})
  })

  it('should change language when clicking the switcher (MIP details page, darkmode)',()=>{
    cy.get('div.darkModeToggler').click()

    cy.visit('/mips/details/MIP1')
    cy.get('app-proposal-components').contains('Contents',{matchCase:false})

    cy.get('.sidebar-wrapper').contains('Languages',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Details',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Title',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Status',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Tags',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Date Proposed',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Date Ratified',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Author',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Contributor',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Dependencies',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Replaces',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Type',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('References',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Recent Changes',{matchCase:false})

    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(0).click()

    cy.get('app-proposal-components').contains('Contenido',{matchCase:false})

    cy.get('.sidebar-wrapper').contains('Idiomas',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Detalles',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Título',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Estatus',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Etiquetas',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Fecha propuesta',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Fecha de ratificación',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Autor',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Contribuyente',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Dependencias',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Replaces',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Tipo',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Referencias',{matchCase:false})
    cy.get('.sidebar-wrapper').contains('Cambios Recientes',{matchCase:false})
  })
})
