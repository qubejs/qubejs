/* eslint-disable */
export default {
  displayName: 'core',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  reporters: ['default', ['jest-junit',  {outputDirectory: 'coverage/libs/core', outputName: 'junit.xml'}]],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/core',
};
