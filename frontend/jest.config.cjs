module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": [
      "esbuild-jest",
      {
        loaders: {
          ".js": "jsx",  // Ensure JSX is transformed
          ".jsx": "jsx",
          ".ts": "tsx",
          ".tsx": "tsx",
        },
      },
    ],
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],  // Optional setup file
  transformIgnorePatterns: [
    'node_modules/(?!(lodash-es|@mui|@emotion)/)',  // Make sure these are transformed
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',  // Mock CSS imports
  },
};
