export function fakeMips(large = false) {
  cy.intercept(
    {
      pathname: "/mips/findall",
    },
    {
      fixture: large ? "mips_large.json" : "mips.json",
    }
  ).as(large? "MIPsLarge" : "MIPs");
}
