Given(
  "Origin {string} is set to be mocked as baseUrl with alias {string}",
  (origin, alias) => {
    cy.intercept(`${origin}/**`, (request) => {
      request.url = request.url.replace(origin, "http://localhost:4200");
    }).as(alias);
  }
);

Given(
  "Origin {string} is set to be mocked as fake site with alias {string}",
  (origin, alias) => {
    cy.intercept(`${origin}/**`, (request) => {
      request.url = request.url.replace(origin, "http://localhost:4200");
      request.reply((res) => res.send({ fixture: "fakeSite.html" }));
    }).as(alias);
  }
);
