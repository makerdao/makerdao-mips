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

  // it('should find MIps containing giving keywords', () => {
  //   const keywords = ["proposal"];
  //
  //   keywords.forEach($word => {
  //     cy.visit('')
  //
  //     cy.get('[data-cy=search-input]').type($word)
  //     cy.get('[data-cy=search-input]').type('{enter}')
  //     cy.get('[data-cy=table-list-mips]').should('be.visible')
  //
  //     const rows = []
  //
  //     cy.get('[data-cy=table-list-mips] tr.maker-element-row').each(($row) => {
  //
  //         cy.wrap($row).find("a").then($link => {
  //           if (Cypress.$($link).hasClass('mipTitleList')) {
  //             const $href = Cypress.$($link).attr("href");
  //             rows.push($href);
  //           }
  //         });
  //     });
  //
  //       cy.wrap(rows).each($row => {
  //         cy.visit($row);
  //         cy.get(".row.row-tree-column").contains($word,{matchCase:false});
  //       });
  //     })
  //   });
  //
  // it('should find MIps with the pattern MIP#', () => {
  //   const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  //
  //   values.forEach(value => {
  //     cy.visit('')
  //     cy.get('[data-cy=search-input]').clear()
  //     cy.get('[data-cy=search-input]').type('MIP' + value)
  //     cy.get('[data-cy=search-input]').type('{enter}')
  //
  //     cy.get('[data-cy=table-list-mips] tr.maker-element-row td.mat-column-pos').each(($col) => {
  //       cy.wrap($col).invoke('text').invoke('trim').should($text => {
  //         if ($text !== '' && $text !== '-1') {
  //           expect($text).to.contain(value);
  //         }
  //       })
  //     })
  //   })
  // })
})
