import packageJson from '../../package.json';

export const environment = {
  production: false,
  mockUser: true,
  appVersion: packageJson.version,
  apiUrl: 'https://localhost:5000/api',
};
