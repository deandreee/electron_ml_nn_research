// import { runConfigXGOpts, RunConfigXG } from "./runConfigXG";
// import * as Genetic from "genetic-js";

// const takeRandom = (arr: number[]) => {
//   return arr[Math.floor(Math.random() * arr.length)];
// };

// export const create = () => {
//   const gaConfig = {
//     iterations: 20,
//     size: 250,
//     crossover: 1,
//     mutation: 1,
//     skip: 10
//   };

//   const genetic = Genetic.create();

//   genetic.optimize = Genetic.Optimize.Minimize;
//   genetic.select1 = Genetic.Select1.Tournament2;
//   genetic.select2 = Genetic.Select2.FittestRandom;

//   genetic.seed = (): RunConfigXG => {
//     return {
//       idx: 1,
//       eta: takeRandom(runConfigXGOpts.eta),
//       gamma: takeRandom(runConfigXGOpts.gamma),
//       max_depth: takeRandom(runConfigXGOpts.max_depth),
//       min_child_weight: takeRandom(runConfigXGOpts.min_child_weight),
//       subsample: takeRandom(runConfigXGOpts.subsample),
//       iterations: takeRandom(runConfigXGOpts.iterations)
//     };
//   };

//   return { genetic, gaConfig };
// };
