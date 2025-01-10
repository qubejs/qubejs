/* eslint-disable */
export default {
  displayName: 'server',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'coverage/apps/server', outputName: 'junit.xml' },
    ],
  ],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['/node_modules/(?!react-file-drop)'],

  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/server',
};
