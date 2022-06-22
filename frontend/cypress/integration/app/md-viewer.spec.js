describe('Test MD Viewer', () => {
  beforeEach(() => {
    cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md')
  })

  it('should open box container', () => {
      cy.get('app-proposal-components').should('exist')

      cy.get('app-proposal-components .container .content div').each($div=>{
       cy.wrap($div).click({force:true})
       cy.wait(2000)
    })

    cy.get('app-detail-content div.container').scrollTo('bottom',{ensureScrollable:false})
  });

  it('should open box container on darkmode', () => {
    cy.get('div.darkModeToggler').click()

    cy.get('app-proposal-components').should('exist')

    cy.get('app-proposal-components .container .content div').each($div=>{
      cy.wrap($div).click({force:true})
      cy.wait(2000)
    })

    cy.get('app-detail-content div.container').scrollTo('bottom',{ensureScrollable:false})
  });
})
