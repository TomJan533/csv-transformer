const config = {
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    outputDir: './test-results/', // Store traces, screenshots, etc. in this directory
  },
  testDir: '.', // Relative path to tests

  // Define reporters and specify output paths
  reporter: [
    ['list'], // Displays test results in the console
    ['json', { outputFile: './test-results/results.json' }], // Write test results to a JSON file
    ['junit', { outputFile: './test-results/results.xml' }], // Write test results to an XML file (for CI)
    ['html', { outputFolder: './test-results/html-report' }] // Generate an HTML report
  ],

  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "firefox",
      use: { browserName: "firefox" },
    },
    {
      name: "webkit",
      use: { browserName: "webkit" }, // Safari
    },
  ],
};

export default config;
