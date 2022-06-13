describe('Test Language Change', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('should change language when clicking the switcher',()=>{
    cy.get('a.language-menu').click()

    cy.get('div.language-menu').find('app-menu').eq(0).click()
    cy.get('app-list').contains('resumen',{matchCase:false})
    cy.get('app-list').contains('estado',{matchCase:false})
    cy.get('app-list').contains('enlaces',{matchCase:false})

    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(1).click()
    cy.get('app-list').contains('TITLE',{matchCase:false})
    cy.get('app-list').contains('SUMMARY',{matchCase:false})
    cy.get('app-list').contains('STATUS',{matchCase:false})
    cy.get('app-list').contains('LINKS',{matchCase:false})
  })
})
