/// <reference types="cypress" />

// Visit a page already "logged in". AuthContext reads localStorage["user"]
// when the app loads, so we set it before the app boots.
Cypress.Commands.add("visitAs", (path, userFixture = "user.json") => {
  cy.fixture(userFixture).then((user) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem("user", JSON.stringify(user));
      },
    });
  });
});

// Stub window.alert so we can assert on the message.
Cypress.Commands.add("stubAlert", () => {
  cy.window().then((win) => {
    cy.stub(win, "alert").as("alert");
  });
});