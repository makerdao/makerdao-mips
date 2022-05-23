describe('Test Regular Search',()=>{
    beforeEach(()=>{
        cy.visit('')
    })
    
    it('should find MIps containing giving keywords',()=>{
        cy.get('[data-cy=search-input]').type('proposal')
        cy.get('[data-cy=search-input]').type('{enter}')

        cy.get('[data-cy=table-list-mips]').should('be.visible')

        cy.get('[data-cy=table-list-mips] tr.maker-element-row').each(($row)=>{
            cy.wrap($row).should('contain.text','roposal')          
        })        
    })
})