const convnetjs = require("convnetjs");

let options = {
  activation_1_type: undefined,
  neurons_1: undefined,
  depth: undefined,
  momentum: undefined,
  decay: undefined,
};

class LR_Mounirs {
  constructor({ minPredictionCount }) {
    this.minPredictionCount = minPredictionCount;
    this.predictionCount = 0;
    this.Price = [];
    this.neural = {
      net: new convnetjs.Net(),
      layer_defs: [
        { type: "input", out_sx: 4, out_sy: 4, out_depth: options.depth },
        {
          type: "fc",
          num_neurons: options.neurons_1,
          activation: options.activation_1_type,
        },
        { type: "regression", num_neurons: 5 },
      ],
      neuralDepth: options.depth,
    };
    this.neural.net.makeLayers(this.neural.layer_defs);
    this.neural.trainer = new convnetjs.SGDTrainer(this.neural.net, {
      learning_rate: 0.05,
      momentum: options.momentum,
      batch_size: 10,
      l2_decay: options.decay,
    });
  }

  update(candle) {
    this.Price.push(candle.close);
    if (this.Price.length > 2) {
      this.learn(this.Price);

      if (this.predictionCount >= this.minPredictionCount) {
        return this.predict(this.Price);
      }
    }

    return null;
  }

  learn() {
    for (var i = 0; i < this.Price.length - 1; i++) {
      var data = this.Price.slice(i, i + 1);
      var real_value = [this.Price[i + 1]];
      var x = new convnetjs.Vol(data);
      this.neural.trainer.train(x, real_value);
      var predicted_values = this.neural.net.forward(x);
      var accuracymatch = predicted_values.w[0] == real_value;
      this.neural.net.backward(accuracymatch); // var rewardtheybitches = | variable not needed but I think backward() does something though
      this.predictionCount++;
    }
  }

  predict(data) {
    var x = new convnetjs.Vol(data);
    var predicted_value = this.neural.net.forward(x);
    return predicted_value.w[0];
  }
}

module.exports = LR_Mounirs;
