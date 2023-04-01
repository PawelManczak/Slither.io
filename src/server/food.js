const GameObject = require('./gameobject');
const {MAP_SIZE, FOOD_AMOUNT_PER_SQUARE, FOOD_SQUARE} = require('../shared/constants');

class Food extends GameObject {
  constructor(x, y) {
    super(x, y);
  }
}

class FoodManager {
  constructor() {
    this.food = [];
    this.maxFoodAmount = (MAP_SIZE / FOOD_SQUARE) ** 2 * FOOD_AMOUNT_PER_SQUARE;
  }

  update(delta) {
    while (this.food.length < this.maxFoodAmount) {
      this.addFood();
    }
  }

  addFood() {
    const x = MAP_SIZE * Math.random();
    const y = MAP_SIZE * Math.random();
    this.food.push(new Food(x, y));
  }

  removeFood(food) {
    this.food = this.food.filter((obj) => (obj != food));
    food.delete();
  }

  serialize() {
    return this.food.map((obj) => ({x: obj.x, y: obj.y}));
  }
}

module.exports = {Food, FoodManager};
