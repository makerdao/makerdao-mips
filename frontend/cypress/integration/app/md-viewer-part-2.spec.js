/// <reference types="cypress" />
describe('Test Regular Search', () => {
  beforeEach(() => {
    cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md')
  })

  it('Left navigation panel updates the hash in the url and scroll the section into view', () => {
    cy.get('app-proposal-components a').each(($link, idx) => {
      if(!idx)return; // For first element is the title
      const id = $link.attr('id');
      const sectionName = id.substring(12);
      cy.get('app-proposal-components a').eq(idx).click({ force: true });
      cy.location('hash').invoke('substring', 1).should('equal', sectionName);
      cy.wrap(sectionName);
      cy.window().then(win => {
        const $section = Cypress.$(`[name=${sectionName}]`);
        cy.wrap($section.offset());

        cy.wrap(!!$section).should('be.true');

        const elementTop = $section.offset().top;
        const elementBottom = elementTop + $section.outerHeight();

        const viewportTop = Cypress.$(win).scrollTop();
        const viewportBottom = viewportTop + Cypress.$(win).height();

        const isInViewPort = elementBottom > viewportTop && elementTop < viewportBottom;

        cy.wrap(isInViewPort).should('be.true');
      });
    });
  });

  it('Scroll down/up should update the hash in url and the selected header in left panel', () => {
    cy.viewport(4096,250); // allows to trigger scroll into every section
    cy.get('h2 a, h3 a').then($headers => {
      const headers = $headers.get();

      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        cy.scrollTo(0, header.parentElement.offsetTop+2);
        cy.wait(100);
        cy.scrollTo(0, header.parentElement.offsetTop);
        cy.wait(100);
        cy.location('hash').invoke('substring', 1).should('equal', header.id);
        cy.get('app-proposal-components a').eq(i+1).should('have.class','active');
      }

      for (let i = headers.length - 1; i >= 0; i--) {
        const header = headers[i];
        cy.scrollTo(0, header.parentElement.offsetTop + 1);
        cy.wait(100);
        cy.location('hash').invoke('substring', 1).should('equal', header.id);
        cy.get('app-proposal-components a').eq(i+1).should('have.class','active');
      }
    })
  });
})
