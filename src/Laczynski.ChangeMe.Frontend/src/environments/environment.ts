import packageJson from '../../package.json';

export const environment = {
  production: true,
  appVersion: packageJson.version,
  apiUrl: 'https://localhost:5001/api'
};
