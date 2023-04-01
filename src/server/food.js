const tinycolor = require('tinycolor2');
const GameObject = require('./gameobject');
const {MAP_SIZE, FOOD_AMOUNT_PER_SQUARE, FOOD_SQUARE, FOOD_MIN_SIZE, FOOD_MAX_SIZE,
  PLAYER_DIAMETER, PERCENT_OF_BODY_COMPOSTED} = require('../shared/constants');
const {getEveryNth, randomInteger} = require('../shared/helpers.js');

class Food extends GameObject {
  constructor(x, y, fromPlayer) {
    super(x, y);
    this.fromPlayer = fromPlayer;
    this.color = tinycolor.random().toHexString();
    this.size = randomInteger(FOOD_MIN_SIZE, FOOD_MAX_SIZE);
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      size: this.size,
      color: this.color,
    };
  }
}

class FoodManager {
  constructor() {
    this.food = [];
    this.bodyFood = [];
    this.maxFoodAmount = (MAP_SIZE / FOOD_SQUARE) ** 2 * FOOD_AMOUNT_PER_SQUARE;
  }

  update(delta) {
    while (this.food.length < this.maxFoodAmount) {
      this.generateFood();
    }
  }

  generateFood() {
    const x = MAP_SIZE * Math.random();
    const y = MAP_SIZE * Math.random();
    this.food.push(new Food(x, y, false));
  }

  compostBody(player) {
    // TODO: color of compost should represent color of player
    const compostFoodNumber = Math.floor(player.bodyparts.length/PERCENT_OF_BODY_COMPOSTED);
    getEveryNth(player.bodyparts, compostFoodNumber).forEach(
        (bodypart) => {
          const x = bodypart.x + PLAYER_DIAMETER*(Math.random()-0.5);
          const y = bodypart.y + PLAYER_DIAMETER*(Math.random()-0.5);
          this.bodyFood.push(new Food(x, y, true));
        },
    );
  }

  removeFood(food) {
    if (food.fromPlayer) {
      this.bodyFood = this.bodyFood.filter((obj) => (obj != food));
    } else {
      this.food = this.food.filter((obj) => (obj != food));
    }
    food.delete();
  }

  serialize() {
    const foodPositions = this.food.concat(this.bodyFood).map((obj) => obj.serialize());
    return foodPositions;
  }
}

module.exports = {Food, FoodManager};
