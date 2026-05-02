import packageJson from '../../package.json';

export const environment = {
  production: false,
  appVersion: packageJson.version,
  apiUrl: 'https://localhost:5001/api'
};
