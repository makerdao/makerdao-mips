describe('Test MD Viewer', () => {
  beforeEach(() => {
    cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md')
  })

  it('should open box container', () => {
    cy.get('app-proposal-components').should('exist')

    cy.get('app-proposal-components .container .content > div').its('length').then($amount=>{
      for (let c =0 ; c < $amount; c++){
        cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md')
        cy.wait(2000)
        cy.get('app-proposal-components .container .content > div').eq(c).click()
        cy.wait(2000)
        cy.location().then($loc=>{
          cy.get('app-proposal-components .container .content > div').eq(c).invoke('text').invoke('trim').should('contain',$loc.hash.substring(2).split('-')[0])
          cy.wait(4000)
        })

      }
    })

     cy.get('app-detail-content div.container').scrollTo('bottom',{ensureScrollable:false})
  });

  it('should open box container on darkmode', () => {
    cy.get('div.darkModeToggler').click()

    cy.get('app-proposal-components').should('exist')

    cy.get('app-proposal-components .container .content > div').its('length').then($amount=>{
    for (let c =0 ; c < $amount; c++){
      cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md')
      cy.wait(2000)
      cy.get('app-proposal-components .container .content > div').eq(c).click()
      cy.wait(2000)
      cy.location().then($loc=>{
        cy.get('app-proposal-components .container .content > div').eq(c).invoke('text').invoke('trim').should('contain',$loc.hash.substring(2).split('-')[0])
        cy.wait(4000)
      })

    }
  })

  cy.get('app-detail-content div.container').scrollTo('bottom',{ensureScrollable:false})

  });

  it('should open box container on spanish language', () => {
    cy.visit('')
    cy.get('a.language-menu').click()
    cy.get('div.language-menu').find('app-menu').eq(0).click()

    cy.wait(2000)

    cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md')

    cy.get('app-proposal-components').should('exist')

    cy.get('app-proposal-components .container .content > div').its('length').then($amount=>{
      for (let c =0 ; c < $amount; c++){
        cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP1%2FMIP1c4-Subproposal-Template.md')
        cy.wait(2000)
        cy.get('app-proposal-components .container .content > div').eq(c).click()
        cy.wait(2000)
        cy.location().then($loc=>{
          cy.get('app-proposal-components .container .content > div').eq(c).invoke('text').invoke('trim').should('contain',$loc.hash.substring(2).split('-')[0])
          cy.wait(4000)
        })
        }
    })
  });
})
