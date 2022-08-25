/// <reference types="Cypress" />

import { And } from "cypress-cucumber-preprocessor/steps";

And('{string} ms are past',(ms)=>{
    cy.wait(+ms);
})

And('The page is reloaded',()=>{
    cy.reload();
})

And('The user opens the main page',()=>{
    cy.visit('');
})