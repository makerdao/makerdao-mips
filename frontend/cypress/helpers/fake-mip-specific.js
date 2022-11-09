/// <reference types="Cypress" />

const mip1 = require("../fixtures/mip1.json");
const mip2 = require("../fixtures/mip2.json");
const mip4 = require("../fixtures/mip4.json");
const mip6 = require("../fixtures/mip6.json");
const mip7 = require("../fixtures/mip7.json");
const mip8 = require("../fixtures/mip8.json");
const mip9 = require("../fixtures/mip9.json");
const mipDefault = require("../fixtures/mip.json");

const mips = { mip1, mip2, mip4, mip6, mip7, mip8, mip9 };
console.log({ mips });

export function fakeMipSpecific() {
  cy.intercept(
    {
      pathname: "/mips/findone",
      query: { mipName: "*" },
    },
    (req) => {
      console.log({ name: req.query.mipName.toLowerCase() });
      console.log(mips[req.query.mipName.toLowerCase()]);
      req.reply(mips[req.query.mipName.toLowerCase()] || mipDefault);
    }
  ).as("MIPSpecific");
}
