/// <reference types="cypress" />
describe('Special Search', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('');
    cy.viewport('macbook-16');
  })

  it('should find given status in MIPs list', () => {
    const valueOne = '$OR(@ACCEPTED,@OBSOLETE)';

    // cy.get('[data-cy=search-input]').clear()
    cy.get('[data-cy=search-input]').type(valueOne)
    cy.get('[data-cy=search-input]').type('{enter}')

    const expressionRegexOne = /(ACCEPTED|OBSOLETE)/i

    cy.get('[data-cy=table-list-mips] tr.maker-element-row:not(.maker-expanded-row) td.mat-column-status').each(($row) => {
      cy.wrap($row).invoke('text').should('match', expressionRegexOne);
    })

    cy.visit('')
    const valueTwo = '$OR(@OBSOLETE,@RFC)'

    // cy.get('[data-cy=search-input]').clear()
    cy.get('[data-cy=search-input]').type(valueTwo)
    cy.get('[data-cy=search-input]').type('{enter}')

    const expressionRegexTwo = /(OBSOLETE|RFC)/i

    cy.get('[data-cy=table-list-mips] tr.maker-element-row:not(.maker-expanded-row) td.mat-column-status').each(($row) => {
      cy.wrap($row).invoke('text').should('match', expressionRegexTwo);
    })
  })

  it('Should show "No results found" message', () => {
    const invalidSearch = '$ AND(@ACCEPTED, @OBSOLETE) ';
    cy.get('[data-cy=search-input]').type(invalidSearch).type('{esc}{enter}');
    cy.get('.no-result').should('be.visible');
  });

  it('Results should have tha entered tags', () => {
    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(0).click()
    cy.wait(2000)

    const dataset = [
      ['collateral-onboarding', 'mip-set'],
      ['core unit', 'facilitator', 'personnel-xboarding']
    ];

    for(const test of dataset) {
      const query = `$ AND(${test.map(tag => `#${tag}`).join(',')})`;

      cy.get('[data-cy=search-input]').clear().type(query).type('{esc}{enter}{enter}');
      cy.get('body').then($body => {
        if ($body.find('tr[data-cy=search-result], tr[data-cy=subporposal-row]')?.length) {
          cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').each((_, idx) => {
            cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').eq(idx).click();
            for(const tag of test) {
              cy.get('[data-cy=details-tags]').should('contain', tag);
            }
            cy.go('back');
          });
        }
      })
    }
  })

  it('Results of an OR inside an AND should have the status and tags entered', () => {
    const testTags = ['mip-set', 'collateral-onboarding'];
    const testStatuses = ['ACCEPTED', 'REJECTED'];

    for (let i = 0; i < testTags.length; i++) {
      for (let j = 0; j < testStatuses.length; j++) {
        const tags = testTags.slice(i);
        const statuses = testStatuses.slice(j);
        const query = `$ AND(${tags.map(tag => `#${tag}`).join(',')}, OR(${statuses.map(status => `@${status}`).join(',')}))`;

        cy.get('[data-cy=search-input]').clear().type(query).type('{esc}{enter}{enter}');
        cy.get('body').then($body => {
          if ($body.find('tr[data-cy=search-result], tr[data-cy=subporposal-row]')?.length) {
            cy.get('tr[data-cy=search-result] [data-cy=status], tr[data-cy=subporposal-row] [data-cy=status]').each($el => {
              const regexp = new RegExp(statuses.join('|'), 'i');
              cy.wrap($el).invoke('text').should('match', regexp);
            })
            cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').each((_, idx) => {
              cy.get('tr[data-cy=search-result], tr[data-cy=subporposal-row]').eq(idx).click();
              for(const tag of tags) {
                cy.get('[data-cy=details-tags]').should('contain', tag);
              }
              cy.go('back');
            });
          }
        })
      }
    }
  })
});
