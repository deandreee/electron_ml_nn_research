export const start = (name: string) => {
  time(name);
  console.log(`-------------------- RUNNING ${name} --------------------`);
};

export const end = (name: string) => {
  timeEnd(name);
};

const times: { [name: string]: number } = {};
export const time = (name: string) => {
  if (times[name]) {
    throw new Error(`Time for ${name} already running`);
  }

  times[name] = new Date().getTime();
};

export const timeEnd = (name: string) => {
  const start = times[name];
  if (!start) {
    throw new Error(`Start time for ${name} not found`);
  }

  delete times[name];

  const end = new Date().getTime();

  const elapsedSeconds = Math.round((end - start) / 1000);
  console.log(`-------------------- TIME ${name}:     ${elapsedSeconds}s -------------------- `);
};
