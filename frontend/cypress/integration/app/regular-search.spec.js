<<<<<<< HEAD
describe('Test Regular Search', () => {
  beforeEach(() => {
    cy.visit('')
  })

  it('should find MIps containing giving keywords', () => {
    const keywords = ["proposal", "admin"];

    keywords.forEach($word => {
      cy.visit('')

      cy.get('[data-cy=search-input]').type($word)
      cy.get('[data-cy=search-input]').type('{enter}')
      cy.get('[data-cy=table-list-mips]').should('be.visible')

      const rows = []

      cy.get('[data-cy=table-list-mips] tr.maker-element-row').each(($row) => {
        cy.wrap($row).find("a").then($link => {
          if (Cypress.$($link).hasClass('mipTitleList')){
            const $href = Cypress.$($link).attr("href");
            rows.push($href);
          }
        });
      })

      cy.wrap(rows).each($row => {
        // console.log($row);
        cy.visit($row);
        cy.get(".row.row-tree-column").should("contain.text", $word.substr(1));
=======
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
>>>>>>> 0590c7546ea0179064df3e79407a0fa856b1389c
      })
    })
  })
})
