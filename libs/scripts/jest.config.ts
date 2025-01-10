/* eslint-disable */
export default {
  displayName: 'scripts',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  reporters: ['default', ['jest-junit',  {outputDirectory: 'coverage/libs/scripts', outputName: 'junit.xml'}]],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/scripts',
};
