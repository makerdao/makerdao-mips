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

    const links = []

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
  //         cy.get(".row.row-tree-column").should("contain.text", $word.substr(1));
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
