/** biome-ignore-all lint/suspicious/noExplicitAny: Don't fix this lol */
export {};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": any;
      "a-assets": any;
      "a-audiosphere": any;
      "a-videosphere": any;
      "a-entity": any;
      "a-camera": any;
    }
  }
}
