/// <reference types="cypress" />
 
describe("Signup page (adds a new user)", () => {
  beforeEach(() => {
    // Dashboard calls GET /reports after signup - keep it deterministic.
    cy.intercept("GET", "**/reports", []).as("getReports");
 
    // The app opens on the Sign Up form by default.
    cy.visit("/");
    cy.contains("h1", "SIGN UP").should("be.visible");
    cy.stubAlert();
  });
 
  const fillForm = ({ name, email, password, confirm }) => {
    cy.get('input[name="name"]').type(name);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm"]').type(confirm);
  };
 
  it("creates a new account and lands on the user dashboard", () => {
    cy.intercept("POST", "**/signup", {
      statusCode: 201,
      body: {
        id: "64f000000000000000000002",
        name: "New Person",
        email: "newperson@example.com",
        role: "user",
        token: "fake-signup-token",
      },
    }).as("signup");
 
    fillForm({
      name: "New Person",
      email: "newperson@example.com",
      password: "password123",
      confirm: "password123",
    });
    cy.get('button[type="submit"]').click();
 
    // The app should send exactly what we typed
    cy.wait("@signup").its("request.body").should("deep.equal", {
      name: "New Person",
      email: "newperson@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
 
    cy.get("@alert").should("have.been.calledWithMatch", /Welcome to SPDMS/);
    cy.url().should("include", "/user");
 
    // The new user is stored so they stay logged in
    cy.window().then((win) => {
      const saved = JSON.parse(win.localStorage.getItem("user"));
      expect(saved.email).to.eq("newperson@example.com");
    });
  });
 
  it("shows the server message when passwords do not match", () => {
    cy.intercept("POST", "**/signup", {
      statusCode: 400,
      body: { message: "Passwords do not match" },
    }).as("signup");
 
    fillForm({
      name: "New Person",
      email: "newperson@example.com",
      password: "password123",
      confirm: "different123",
    });
    cy.get('button[type="submit"]').click();
 
    cy.wait("@signup");
    cy.get("@alert").should("have.been.calledWith", "Passwords do not match");
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });
 
  it("shows the server message when the email is already registered", () => {
    cy.intercept("POST", "**/signup", {
      statusCode: 400,
      body: { message: "An account with this email already exists" },
    }).as("signup");
 
    fillForm({
      name: "Wednesday Adams",
      email: "wednesdayadams@example.com",
      password: "password123",
      confirm: "password123",
    });
    cy.get('button[type="submit"]').click();
 
    cy.wait("@signup");
    cy.get("@alert").should(
      "have.been.calledWith",
      "An account with this email already exists"
    );
    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
  });
 
  it("tells the user when the server cannot be reached", () => {
    cy.intercept("POST", "**/signup", { forceNetworkError: true }).as("signup");
 
    fillForm({
      name: "New Person",
      email: "newperson@example.com",
      password: "password123",
      confirm: "password123",
    });
    cy.get('button[type="submit"]').click();
 
    cy.get("@alert").should("have.been.calledWith", "Unable to connect to the server.");
  });
 
  it("switches to the login form when 'Login' is clicked", () => {
    cy.contains("span", "Login").click();
    cy.contains("h1", "LOGIN").should("be.visible");
  });
});