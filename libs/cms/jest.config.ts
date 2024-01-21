/* eslint-disable */
export default {
  displayName: 'cms',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  reporters: ['default', ['jest-junit',  {outputDirectory: 'coverage/libs/cms', outputName: 'junit.xml'}]],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/cms',
};
