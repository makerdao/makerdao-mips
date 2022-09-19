/// <reference types="cypress" />

Given("Search params are passed in the url", () => {
  const search = {
    customViewName: "Dai Foundation Core Unit (DAIF-001) Subproposals",
    "_Active Subproposals": "$AND(#active,#cu-daif-001)",
    _Archive: "$AND(NOT(#active),#cu-daif-001)",
    shouldBeExpandedMultiQuery: "true",
    hideParents: "false",
  };
  const params = new URLSearchParams(search);
  const url = `/mips/list?${params.toString()}`;
  cy.visit(url);
});
