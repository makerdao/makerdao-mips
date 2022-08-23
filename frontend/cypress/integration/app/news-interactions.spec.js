/// <reference types="cypress" />

import jsYaml from "js-yaml";

describe("Test News Interactions", () => {
  beforeEach(() => {
    cy.visit("");
  });
  it("should render the news UI above the page", () => {
    cy.get("app-list-page app-news").should("be.visible");
    cy.get("app-list-page app-news")
      .find(".container")
      .each(($container) => {
        if (Cypress.$($container).hasClass("container-green")) {
          cy.wrap($container).find(".item-icon-green").should("exist");
        }
        if (Cypress.$($container).hasClass("container-yellow")) {
          cy.wrap($container).find(".item-icon-yellow").should("exist");
        }
        if (Cypress.$($container).hasClass("container-red")) {
          cy.wrap($container).find(".item-icon-red").should("exist");
        }
        cy.wrap($container).find(".item-title").should("be.visible");
        cy.wrap($container).find(".item-description").should("be.visible");
      });
  });
  it("should render the news UI above the page on dark modw", () => {
    cy.get("div.darkModeToggler").click();
    cy.get("app-list-page app-news").should("be.visible");
    cy.get("app-list-page app-news")
      .find(".container-dark")
      .each(($container) => {
        if (Cypress.$($container).hasClass("container-green")) {
          cy.wrap($container).find(".item-icon-green").should("exist");
        }
        if (Cypress.$($container).hasClass("container-yellow")) {
          cy.wrap($container).find(".item-icon-yellow").should("exist");
        }
        if (Cypress.$($container).hasClass("container-red")) {
          cy.wrap($container).find(".item-icon-red").should("exist");
        }
        cy.wrap($container).find(".item-title").should("be.visible");
        cy.wrap($container).find(".item-description-dark").should("be.visible");
      });
  });
  it("should render the news UI above the page on Spanish language", () => {
    cy.get("a.language-menu").click();
    cy.get("div.language-menu").find("app-menu").eq(0).click();
    cy.get("app-list-page app-news").should("be.visible");
    cy.get("app-list-page app-news")
      .find(".container")
      .each(($container) => {
        if (Cypress.$($container).hasClass("container-green")) {
          cy.wrap($container).find(".item-icon-green").should("exist");
        }
        if (Cypress.$($container).hasClass("container-yellow")) {
          cy.wrap($container).find(".item-icon-yellow").should("exist");
        }
        if (Cypress.$($container).hasClass("container-red")) {
          cy.wrap($container).find(".item-icon-red").should("exist");
        }
        cy.wrap($container).find(".item-title").should("be.visible");
        cy.wrap($container).find(".item-description").should("be.visible");
      });
  });
  it("should render the news UI above the page on dark modw with spanish language", () => {
    cy.get("a.language-menu").click();
    cy.get("div.language-menu").find("app-menu").eq(0).click();
    cy.get("div.darkModeToggler").click();
    cy.get("app-list-page app-news").should("be.visible");
    cy.get("app-list-page app-news")
      .find(".container-dark")
      .each(($container) => {
        if (Cypress.$($container).hasClass("container-green")) {
          cy.wrap($container).find(".item-icon-green").should("exist");
        }
        if (Cypress.$($container).hasClass("container-yellow")) {
          cy.wrap($container).find(".item-icon-yellow").should("exist");
        }
        if (Cypress.$($container).hasClass("container-red")) {
          cy.wrap($container).find(".item-icon-red").should("exist");
        }
        cy.wrap($container).find(".item-title").should("be.visible");
        cy.wrap($container).find(".item-description-dark").should("be.visible");
      });
  });
  it("shouldnt render the new on another views", () => {
    cy.visit("/mips/list?mipsetMode=true");
    cy.get("app-list-page app-news").should("not.exist");
    cy.visit("/mips/details/MIP1");
    cy.get("app-list-page app-news").should("not.exist");
    cy.visit(
      "/mips/md-viewer?mdUrl=https:%2F%2Fraw.githubusercontent.com%2Fmakerdao%2Fmips%2Fmaster%2Fmeta%2Fprimer_for_authors%2Fprimer_for_authors.md"
    );
    cy.get("app-list-page app-news").should("not.exist");
    cy.visit("/mips/details/MIP38#mip38c2-core-unit-state&hideParents=false?");
    cy.get("app-list-page app-news").should("not.exist");
  });
  it("should display news content and style according to news.yaml file", () => {
    let vars = {};
    let news = {};
    cy.intercept("**/vars.yaml*", (req) => {
      return req.continue((res) => {
        vars = jsYaml.load(res.body);
        // return cy.wrap(jsYaml.load(res.body)).as("vars");
      });
    }).as("varsRequest");
    cy.intercept("**/news.yaml*", (req) => {
      req.continue((res) => {
        news = jsYaml.load(res.body);
        // return cy.wrap(jsYaml.load(res.body)).as("news");
      });
    }).as("newsRequest");

    cy.visit("");

    cy.wait("@newsRequest").then(() => cy.wrap(news).as("news"));
    cy.wait("@varsRequest").then(() => cy.wrap(vars).as("vars"));

    cy.get("@vars").then((vars) => {
      cy.get("@news").then((news) => {
        cy.get("[class*=container-] > .icon > img").each(($new, index) => {
          const item = news.data[index];
          let title = item.title;
          if (title.startsWith("$")) {
            title = vars.news[title.replace("$", "")];
          }
          let className = `container-${item.type.toLowerCase()}`;
          const elementTitle = $new.parent().parent().find('.item-title')[0].textContent.trim();
          cy.wrap(elementTitle).should('eq',title);
          cy.wrap($new.parent().parent()).should('have.class',className);
        });
      });
    });
  });

  // times should match fixture fakeNews.yaml timelock's for each kind of new
  // The greater the time, the lower the probability for te test to fail because of connection speed
  const times = { red: 4000, yellow: 4000, green: 4000 };
  it("should reload new past the proper configured time after close", () => {
    cy.intercept("**/news.yaml*", { fixture: "fakeNews.yaml" }).as(
      "yamlRequest"
    );
    cy.visit("");

    cy.get(".container-green > .icon > img").click();
    cy.wait(times.green / 2).reload();
    cy.get(".container-green > .icon > img").should("not.exist");
    cy.wait(times.green / 2).reload();
    cy.get(".container-green > .icon > img").should("exist");

    cy.get(".container-yellow > .icon > img").click();
    cy.wait(times.yellow / 2).reload();
    cy.get(".container-yellow > .icon > img").should("not.exist");
    cy.wait(times.yellow / 2).reload();
    cy.get(".container-yellow > .icon > img").should("exist");

    cy.get(".container-red > .icon > img").click();
    cy.wait(times.red / 2).reload();
    cy.get(".container-red > .icon > img").should("not.exist");
    cy.wait(times.red / 2).reload();
    cy.get(".container-red > .icon > img").should("exist");
  });
});
