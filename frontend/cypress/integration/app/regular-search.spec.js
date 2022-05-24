describe('Test Regular Search',()=>{
    beforeEach(()=>{
        cy.visit('')
    })

    // it('should find MIps containing giving keywords',()=>{
    //     cy.get('[data-cy=search-input]').type('proposal')
    //     cy.get('[data-cy=search-input]').type('{enter}')
    //
    //     cy.get('[data-cy=table-list-mips]').should('be.visible')
    //
    //     cy.get('[data-cy=table-list-mips] tr.maker-element-row').each(($row)=>{
    //         cy.wrap($row).should('contain.text','roposal')
    //     })
    // })

  it('should find MIps with the pattern MIP#',()=>{
    const values =['1','2','3','4','5','6','7','8','9','10']

    values.forEach(value=>{
      cy.visit('')
      cy.get('[data-cy=search-input]').clear()
      cy.get('[data-cy=search-input]').type('MIP'+value)
      cy.get('[data-cy=search-input]').type('{enter}')

      cy.get('[data-cy=table-list-mips] tr.maker-element-row td.mat-column-pos').each(($col)=>{
        cy.wrap($col).invoke('text').invoke('trim').should($text=>{
          if ($text !== '' && $text !== '-1'){
            expect($text).to.contain(value);
          }
        })
      })
    })
  })
})
