const { MAP_SIZE, FOOD_AMOUNT_PER_SQUARE, FOOD_SQUARE } = require('../shared/constants');

class FoodManager {
    constructor() {
        this.food = [];
        this.maxFoodAmount = (MAP_SIZE / FOOD_SQUARE)**2 * FOOD_AMOUNT_PER_SQUARE;
    }

    update(delta) {
        while (this.food.length < this.maxFoodAmount) {
            this.addFood();
        }
    }

    addFood() {
        const x = MAP_SIZE * Math.random();
        const y = MAP_SIZE * Math.random();
        this.food.push({ x: x, y: y });
    }

    serialize() {
        return this.food;
    }
}

module.exports = FoodManager;
