module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    collectCoverage: true,
    coverageDirectory: "coverage",
    reporters: [
      "default",
      [ "jest-junit", {
        outputDirectory: "reports",
        outputName: "test-report.xml"
      }]
    ],
  };
  