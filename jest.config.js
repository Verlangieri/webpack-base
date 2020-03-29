// jest.config.js
const { defaults } = require("jest-config");
module.exports = {
  // ...
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "js,",
    "jsx",
    "ts",
    "tsx"
  ],
  // ...
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "^@common(.*)$": "<rootDir>/src/common$1"
  },
  moduleDirectories: ["node_modules", "src"]
};
