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
      })
    })
  })
})
