import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "react-markdown":
      "<rootDir>/node_modules/react-markdown/react-markdown.min.js",
  },
  transformIgnorePatterns: ["node_modules/(?!(remark-gfm|react-markdown)/)"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
