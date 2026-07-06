import { env } from './env';
import { defaultConfig } from '../../config/default';
import { developmentConfig } from '../../config/development';
import { productionConfig } from '../../config/production';
import { testConfig } from '../../config/test';

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function mergeDeep<T extends object>(base: T, override: DeepPartial<T>): T {
  const result = { ...base } as T;
  for (const key of Object.keys(override) as (keyof T)[]) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (overrideVal !== undefined) {
      if (typeof baseVal === 'object' && !Array.isArray(baseVal) && typeof overrideVal === 'object') {
        (result as Record<keyof T, unknown>)[key] = mergeDeep(
          baseVal as object,
          overrideVal as DeepPartial<object>
        );
      } else {
        (result as Record<keyof T, unknown>)[key] = overrideVal;
      }
    }
  }
  return result;
}

const envOverrides: Record<string, DeepPartial<typeof defaultConfig>> = {
  development: developmentConfig,
  production: productionConfig,
  test: testConfig,
};

const envSpecific = envOverrides[env.NODE_ENV] ?? {};

export const config = mergeDeep(defaultConfig, {
  ...envSpecific,
  http: {
    ...(envSpecific as { http?: object }).http,
    port: env.PORT,
  },
  logging: {
    ...(envSpecific as { logging?: object }).logging,
    level: env.LOG_LEVEL,
  },
});

export type AppConfig = typeof config;
