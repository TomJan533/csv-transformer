const config = {
  use: {
    baseURL: "http://localhost:3000",
  },
  headless: true,
  testDir: './tests',
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
