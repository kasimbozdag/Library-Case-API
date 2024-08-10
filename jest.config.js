module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'], // Define the pattern for test files
    moduleFileExtensions: ['ts', 'js'],
    coverageDirectory: './coverage',
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/index.ts', // Exclude index files if necessary
      '!src/**/types.ts', // Exclude type definition files if necessary
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'src/app.ts',
        'src/routes/',
        'src/config/',
      ],
  };
  