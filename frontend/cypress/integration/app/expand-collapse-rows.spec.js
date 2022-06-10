/// <reference types="cypress" />
describe('Expand and collapse rows', () => {
  beforeEach(() => {
    cy.visit('');
  });

  it('Component opens on MIPS where they are present.', () => {
    cy.get('[data-cy=search-result]').each(($row) => {
      const $btn = $row.find('td:first-child button').get().shift();
      if ($btn) {
        const $expanded = $row.next();

        cy.wrap($btn).click();
        cy.wrap($row).invoke('hasClass', 'maker-expanded-row').should('be.true');
        cy.wrap($expanded).invoke('height').should('be.gt', 2);
        cy.wait(2000);
        cy.wrap($btn).click();
        cy.wrap($row).invoke('hasClass', 'maker-expanded-row').should('be.false');
        cy.wrap($expanded).invoke('height').should('not.be.gt', 2);
      }
    })
  });

  it('SubProposals open on MIPS where they are present.', () => {
    cy.get('[data-cy=search-result]').each(($row) => {
      const $btn = $row.find('td:first-child button').get().shift();
      if ($btn) {
        cy.wrap($btn).click();
        const $expanded = $row.next();
        cy.wrap($expanded).find('.maker-element-subset-row').then($comps => {
          if($comps.length > 1) {
            cy.wrap($comps).each($comp => {
              cy.wrap($comp).find('td button').click();
              cy.wrap($comp.next()).invoke('height').should('be.gt', 2);
              cy.wait(2000);
              cy.wrap($comp).find('td button').click();
              cy.wrap($comp.next()).invoke('height').should('not.be.gt', 2);
            })
          }
        });
      }
    })
  });
})
