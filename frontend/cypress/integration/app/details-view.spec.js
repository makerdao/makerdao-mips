/// <reference types="cypress" />

describe('Details View', () => {
  before(() => {
    cy.visit('/mips/details/MIP1');
    cy.viewport('macbook-16');
  });

  it('Left navigation panel update the hash in the url scroll the section into view', () => {
    cy.get('app-proposal-components a').each(($link, idx) => {
      const id = $link.attr('id');
      const sectionName = id.substring(12);
      cy.get('app-proposal-components a').eq(idx).click({ force: true });
      cy.location('hash').invoke('substring', 1).should('equal', sectionName);

      cy.window().then(win => {
        const $section = Cypress.$(`#${sectionName}`);

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
    cy.get('h2 a, h3 a').then($headers => {
      const headers = $headers.get();

      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        cy.scrollTo(0, header.parentElement.offsetTop);
        cy.wait(100);
        cy.location('hash').invoke('substring', 1).should('equal', header.id);
      }

      for (let i = headers.length - 1; i >= 0; i--) {
        const header = headers[i];
        cy.scrollTo(0, header.parentElement.offsetTop);
        cy.wait(100);
        cy.location('hash').invoke('substring', 1).should('equal', header.id);
      }
    })
  });

  it('Tags Section', () => {
    cy.viewport('macbook-16');
    cy.get('[data-cy=details-tags] a').each((_, idx) => {
      cy.get('[data-cy=details-tags] a').eq(idx).then($link => {
        const tag = $link.text().trim();
        cy.wrap($link).click({ force: true });
        cy.get('[data-cy=search-input]').invoke('text').invoke('trim').should('equal', `$ #${tag}`);
        cy.go('back');
      })
    })
  });


  it('Authors Section', () => {
    cy.viewport('macbook-16');
    cy.get('[data-cy=author-item]').each(($item, idx) => {
      const text = $item.text().trim();
      cy.get('[data-cy=author-item]').eq(idx).click();
      cy.location('search').then(query => {
        const search = new URLSearchParams(query);
        const author = search.get('author');
        cy.wrap(author).should('equal', text);
        cy.go('back');
      })
    })
  });


  it('Contributors Section', () => {
    cy.viewport('macbook-16');
    cy.get('[data-cy=contributor-item]').each(($item, idx) => {
      const text = $item.text().trim();
      cy.get('[data-cy=contributor-item]').eq(idx).click();
      cy.location('search').then(query => {
        const search = new URLSearchParams(query);
        const contributor = search.get('contributor');
        cy.wrap(contributor).should('equal', text);
        cy.go('back');
      })
    })
  });

});
