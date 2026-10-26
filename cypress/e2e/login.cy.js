describe("Login page", () => {
  beforeEach(() => {
    // Dashboard calls GET /reports after login - keep it deterministic.
    cy.intercept("GET", "**/reports", []).as("getReports");
 
    cy.visit("/");
    // The app opens on the Sign Up form first; switch to Login.
    cy.contains("span", "Login").click();
    cy.contains("h1", "LOGIN").should("be.visible");
    cy.stubAlert();
  });
 
  it("logs in with valid credentials and lands on the user dashboard", () => {
    cy.fixture("user.json").then((user) => {
      cy.intercept("POST", "**/login", { statusCode: 200, body: user }).as("login");
    });
 
    cy.get("input[name=\"email\"]").type("wednesdayadams@example.com");
    cy.get("input[name=\"password\"]").type("password123");
    cy.get("button[type=\"submit\"]").click();
 
    // Request carried the Basic auth header the app builds with btoa()
    cy.wait("@login")
      .its("request.headers.authorization")
      .should("eq", `Basic ${btoa("wednesdayadams@example.com:password123")}`);
 
    cy.get("@alert").should("have.been.calledWithMatch", /You.re back/);
    cy.url().should("include", "/user");
 
    // Verify the user details in the profile modal
    cy.get(".profile-avatar img").first().click();
    cy.get(".profile-modal").should("contain.text", "Wednesday Adams");
    cy.get(".profile-modal").should("contain.text", "wednesdayadams@example.com");
  });
 
  it("shows an error and stays on the login page for a wrong password", () => {
    cy.intercept("POST", "**/login", {
      statusCode: 401,
      body: { message: "Invalid password" },
    }).as("login");
 
    cy.get("input[name=\"email\"]").type("wednesdayadams@example.com");
    cy.get("input[name=\"password\"]").type("wrong-password");
    cy.get("button[type=\"submit\"]").click();
 
    cy.wait("@login");
    cy.get("@alert").should("have.been.calledWith", "Invalid password");
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });
 
  it("tells the user when the server cannot be reached", () => {
    cy.intercept("POST", "**/login", { forceNetworkError: true }).as("login");
 
    cy.get("input[name=\"email\"]").type("wednesdayadams@example.com");
    cy.get("input[name=\"password\"]").type("password123");
    cy.get("button[type=\"submit\"]").click();
 
    cy.get("@alert").should("have.been.calledWith", "Unable to connect to server.");
  });
});
 
describe("Route protection", () => {
  it("redirects to the auth page when not logged in", () => {
    cy.visit("/user");
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });
});
 