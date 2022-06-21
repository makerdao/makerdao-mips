describe('Test Regular Search', () => {
  beforeEach(() => {
    cy.visit('/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2FMIP11%2FMIP11c3-Subproposal-Template.md&fromChild=true#preamble')
  })

  it("should scroll to content according to left heading",()=>{
    cy.get('div.content > div').eq(4).click()
  })
})
