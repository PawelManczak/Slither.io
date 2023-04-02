const tinycolor = require('tinycolor2');
const GameObject = require('./gameobject');
const {MAP_SIZE, FOOD_AMOUNT_PER_SQUARE, FOOD_SQUARE, FOOD_MIN_SIZE, FOOD_MAX_SIZE,
  PLAYER_DIAMETER, PERCENT_OF_BODY_COMPOSTED} = require('../shared/constants');
const {getEveryNth, randomInteger} = require('../shared/helpers.js');

class Food extends GameObject {
  constructor(x, y, playerColor) {
    super(x, y, randomInteger(FOOD_MIN_SIZE, FOOD_MAX_SIZE));
    this.fromPlayer = (playerColor != undefined);
    this.color = playerColor ? playerColor : tinycolor.random().toHexString();
  }

  serialize() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      radius: this.radius,
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
    const x = FOOD_MAX_SIZE/2 + (MAP_SIZE-FOOD_MAX_SIZE) * Math.random();
    const y = FOOD_MAX_SIZE/2 + (MAP_SIZE-FOOD_MAX_SIZE) * Math.random();
    this.food.push(new Food(x, y));
  }

  compostBody(player) {
    const compostFoodNumber = Math.floor(player.bodyparts.length/PERCENT_OF_BODY_COMPOSTED);
    getEveryNth(player.bodyparts, compostFoodNumber).forEach(
        (bodypart) => {
          const x = bodypart.x + PLAYER_DIAMETER*(Math.random()-0.5);
          const y = bodypart.y + PLAYER_DIAMETER*(Math.random()-0.5);
          this.bodyFood.push(new Food(x, y, player.color));
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
