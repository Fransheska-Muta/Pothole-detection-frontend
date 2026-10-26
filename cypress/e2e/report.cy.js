describe("Report a pothole (adds new data)", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/reports", []).as("getReports");
 
    // Mock geocoding so tests do not depend on OpenStreetMap / the real API.
    cy.intercept(
      { method: "GET", pathname: "/geocode/suggestions" },
      { fixture: "suggestions.json" }
    ).as("suggestions");
 
    cy.intercept(
      { method: "GET", pathname: "/geocode" },
      { latitude: "-26.2041", longitude: "28.0473", name: "Main Road, Johannesburg" }
    ).as("geocode");
 
    cy.visitAs("/report");
    cy.contains("h1", "Report").should("be.visible");
    cy.stubAlert();
  });
 
  it("refuses to submit an empty form", () => {
    cy.get("button.submit-report").click();
    cy.get("@alert").should("have.been.calledWith", "Please enter the location.");
  });
 
  it("asks for severity when only the location is filled in", () => {
    cy.get("input[placeholder=\"Enter Location\"]").type("Main");
    cy.wait("@suggestions");
    cy.contains(".location-suggestion", "Main Road").click();
 
    cy.get("button.submit-report").click();
    cy.get("@alert").should("have.been.calledWith", "Please select the pothole severity.");
  });
 
  it("submits a new pothole report successfully", () => {
    cy.intercept("POST", "**/report", {
      statusCode: 201,
      body: { message: "Thank you for your report", reportId: "abc123", image: "x.jpg" },
    }).as("createReport");
 
    // 1. Location (pick from the autocomplete list)
    cy.get("input[placeholder=\"Enter Location\"]").type("Main");
    cy.wait("@suggestions");
    cy.contains(".location-suggestion", "Main Road").click();
    cy.get("input[placeholder=\"Enter Location\"]").should(
      "have.value",
      "Main Road, Johannesburg, Gauteng"
    );
 
    // 2. Severity - radio inputs are display:none, so click the label
    cy.contains("label.severity-option", "Medium").click();
    cy.get("input[type=\"radio\"][value=\"Medium\"]").should("be.checked");
 
    // 3. Description
    cy.get("textarea").type("Deep pothole near the traffic light.");
 
    // 4. Image - the file input is hidden, so force it
    cy.get("#image-input").selectFile("cypress/fixtures/pothole5.jpg", { force: true });
    cy.get("img[alt=\"Pothole preview\"]").should("be.visible");
 
    // 5. Submit
    cy.get("button.submit-report").click();
 
    cy.wait("@geocode");
    cy.wait("@createReport").then(({ request }) => {
      expect(request.headers.authorization).to.eq("Bearer fake-jwt-token-for-tests");
      expect(request.headers["content-type"]).to.include("multipart/form-data");
    });
 
    cy.get("@alert").should("have.been.calledWith", "Pothole reported successfully!");
    cy.url().should("include", "/user");
  });
 
  it("shows the server message when the report is rejected", () => {
    cy.intercept("POST", "**/report", {
      statusCode: 400,
      body: { message: "Pothole image is required" },
    }).as("createReport");
 
    cy.get("input[placeholder=\"Enter Location\"]").type("Main");
    cy.wait("@suggestions");
    cy.contains(".location-suggestion", "Main Road").click();
    cy.contains("label.severity-option", "Small").click();
    cy.get("textarea").type("Small crack");
    cy.get("#image-input").selectFile("cypress/fixtures/pothole5.jpg", { force: true });
    cy.get("button.submit-report").click();
 
    cy.wait("@createReport");
    cy.get("@alert").should("have.been.calledWith", "Pothole image is required");
    cy.url().should("include", "/report");
  });
});
 