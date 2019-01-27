import * as Genetic from "@glavin001/genetic-js";
import { Population } from "@glavin001/genetic-js/dist/src/Selection";
import { Stats, GeneticState, Configuration } from "@glavin001/genetic-js";
import { FnFitness, GAEntity, UserData, random5050, takeRandom, takeRandomStr, GAOpts, FnNotification } from "./common";
import * as log from "../../log";

interface GASetup {
  config: Partial<Configuration>;
  userData: UserData;
  gaOpts: GAOpts;
  fnFitness: FnFitness;
  fnNotification?: FnNotification;
}

// Extend the abstract class Genetic.Genetic
export class GACore extends Genetic.Genetic<GAEntity, UserData> {
  fnFitness: FnFitness;
  gaOpts: GAOpts;
  fnNotification: FnNotification;
  idx: number;
  genIdx: number;

  constructor(gaSetup: GASetup) {
    super(gaSetup.config, gaSetup.userData);
    this.fnFitness = gaSetup.fnFitness;
    this.gaOpts = gaSetup.gaOpts;
    this.fnNotification = gaSetup.fnNotification;
    this.idx = 0;
    this.genIdx = 0;
  }

  // more likely allows the most fit individuals to survive between generations
  public select1 = Genetic.Select1.RandomLinearRank;
  // always mates the most fit individual with random individuals
  public select2 = Genetic.Select2.FittestRandom;

  public notification({
    population: pop,
    isFinished
  }: {
    population: Population<GAEntity>;
    generation: number;
    stats: Stats;
    isFinished: boolean;
  }) {
    log.line(`FINISHED GEN ${this.genIdx++}`);
    if (this.fnNotification) {
      this.fnNotification(this.genIdx);
    }
  }

  public optimize = Genetic.Optimize.Maximize;

  shouldContinue(state: GeneticState<GAEntity>) {
    return true;
  }

  createChild(mother: GAEntity, father: GAEntity): GAEntity {
    const child = this.seed();

    for (let k in this.getMutableProps()) {
      child[k] = random5050() === 1 ? mother[k] : father[k];
    }

    return child;
  }

  crossover(mother: GAEntity, father: GAEntity) {
    const child1 = this.createChild(mother, father);
    const child2 = this.createChild(mother, father);

    return [child1, child2] as [GAEntity, GAEntity];
  }

  async fitness(entity: GAEntity) {
    try {
      return await this.fnFitness(entity);
    } catch (err) {
      console.error(`${err.message} | ${JSON.stringify(entity)}`);
      console.error(err.stack);
      return 0;
    }
  }

  getMutableProps() {
    // return Object.keys(entity).filter(x => x !== "idx");

    // let's try this actually
    return Object.keys(this.gaOpts);
  }

  mutate(entity: GAEntity) {
    entity.idx = this.idx++;

    // how many here ... ?
    this.setRandomProp(entity);
    this.setRandomProp(entity);

    return entity;
  }

  setRandomProp(entity: GAEntity) {
    const props = this.getMutableProps();
    const prop1 = takeRandomStr(props) as string;
    entity[prop1] = takeRandom(this.gaOpts[prop1]) as number;
  }

  seed() {
    const base: GAEntity = {};
    const props = this.getMutableProps();
    for (let k of props) {
      if (this.gaOpts[k] === null || this.gaOpts[k] === undefined) {
        throw new Error(`GAOpts empty for key: ${k}`);
      }

      base[k] = takeRandom(this.gaOpts[k]);
    }

    base.idx = this.idx++;

    return base;
  }
}
