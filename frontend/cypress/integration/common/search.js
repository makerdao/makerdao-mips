Then(
  "The mips should be requested with the search criteria {string}",
  (search) => {
    cy.get("@MIPs").then((req) => {
      cy.wrap(req.request.url).should(
        "include",
        // Hardcoded url encode since encodeURI will include dollar sign
        `search=${search.replace(/\s/g, "%20").replace(/#/g, "%23")}`
      );
    });
  }
);

Then(
  "The mips should be requested with filter field {string} with value {string}",
  (field, value) => {
    cy.get("@MIPs").then((req) => {
      cy.wrap(req.request.url).should(
        "include",
        // Hardcoded url encode since encodeURI will include dollar sign
        `filter[contains][0][field]=${field
          .replace(/\s/g, "%20")
          .replace(/#/g, "%23")}`
      );
      cy.wrap(req.request.url).should(
        "include",
        // Hardcoded url encode since encodeURI will include dollar sign
        `filter[contains][0][value]=${value
          .replace(/\s/g, "%20")
          .replace(/#/g, "%23")}`
      );
    });
  }
);
