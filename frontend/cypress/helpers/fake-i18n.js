
export function fakeI18n() {
  cy.intercept(
    {
      pathname: "**/i18n/es*",
    },
    {fixture:'i18n-es.json'}
  ).as("i18nEs");
  cy.intercept(
    {
      pathname: "**/i18n/en*",
    },
    {fixture:'i18n-en.json'}
  ).as("i18nEn");
}
