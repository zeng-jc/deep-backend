import { localConfig, prodConfig } from '../../../config';

const config = {
  development: localConfig,
  production: prodConfig,
};

type localType = keyof typeof localConfig;
type produType = keyof typeof prodConfig;

export function configLoader<T>(configKey: localType | produType): T {
  return config[process.env.NODE_ENV || 'development'][configKey];
}
