// import path from 'path';

/* eslint-disable */
export default {
  displayName: 'web-react',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'coverage/libs/web-react', outputName: 'junit.xml' },
    ],
  ],
  // setupFilesAfterEnv: [path.join(__dirname, 'global-setup.js')],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/web-react',
};
