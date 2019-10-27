// https://github.com/Microsoft/TypeScript/issues/15031
// It automatically makes all js modules any while ts modules keep working as intended.
declare module "*.js" {
  const value: any;
  export default value;
}

// declare module "*";
