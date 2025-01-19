import {type IFuseOptions} from "fuse.js";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Config = {
  hooks: {
    useAsync: {
      onError: (error: Error) => void;
    };
    useFilter: {
      fuseConfig: Omit<IFuseOptions<any>, 'keys'>;
    };
  };
};

const CONFIG:Config = {
  hooks: {
    useAsync: {
      /**@description Callback function to handle errors */
      onError: (error: Error) => {}
    },
    useFilter: {
      /**@description Fuse.js configuration */
      fuseConfig: {} as Omit<IFuseOptions<any>, 'keys'>
    }
  }
}

/**
 * @description Returns the current configuration
 */
export const getConfig = () => CONFIG;

/**
 * @description Sets the configuration
 */
export const setConfig = (value: DeepPartial<Config>) => {
  function deepMerge<T extends object>(base: T, value: DeepPartial<T>): T {
      const result = { ...base } as T;
      for (const key in value) {
          const baseValue = base[key];
          const updateValue = value[key];
          
          if (baseValue && updateValue && typeof baseValue === 'object' && typeof updateValue === 'object') {
              result[key] = deepMerge(baseValue, updateValue);
          } else if (updateValue !== undefined) {
              result[key] = updateValue as T[typeof key];
          }
      }
      return result;
  }

  Object.assign(CONFIG, deepMerge(CONFIG, value));

  return CONFIG;
}