// module.exports = {
//   testEnvironment: "jest-environment-jsdom",
//   setupFilesAfterEnv: ["<rootDir>/.jest/setup-tests.js"],
//   moduleNameMapper: {
//     "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/.jest/__mocks__/fileMock.js",
//   },
//   moduleFileExtensions: ["ts", "js", "jsx", "tsx", "json", "node"],
//   transform: {
//     "^.+\\.ts?$": "ts-jest",
//   },
// };
module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/.jest/setup-tests.js"],
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest",
  },
};
