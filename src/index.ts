import { setConfig } from "./config";

export * from "./hooks";
export * from "./types";

const Reaccoon = {
  /**
   * @description Configure the library
   * @param config The configuration object
   * @returns {Config} the configuration object
   * @example
   * import Reaccoon from "reaccoon";
   * Reaccoon.configure({
   *   hooks: {
   *     useAsync: {
   *       onError: (error:Error) => {
   *         console.error(error);
   *       }
   *     },
   *     useFilter: {
   *       threshold: 0.5
   *     }
   *   }
   * })
   */
  configure: setConfig,
}

export default Reaccoon;