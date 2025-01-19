import { setConfig } from "./config";

export * from "./hooks";

export default class Reaccoon {
  static configure = setConfig;
}