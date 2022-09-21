export function fakeMips() {
  cy.intercept(
    {
      pathname: "/mips/findall",
    },
    {
      fixture: "mips.json",
    }
  ).as("MIPs");
}
