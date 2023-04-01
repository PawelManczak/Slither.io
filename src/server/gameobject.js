const { CELL_SIZE, GRID_CELLS } = require("../shared/constants");

class GameObject {
    static objects = new Set()
    static objectsGrid = new Array(GRID_CELLS).fill(0).map(() => new Array(GRID_CELLS).fill(0).map(() => new Set()))

    constructor(x, y) {
        this._x = x;
        this._y = y;
        GameObject.objectsGrid[this.cellX][this.cellY].add(this);
        GameObject.objects.add(this);
    }

    delete() {
        GameObject.objects.delete(this);
        GameObject.objectsGrid[this.cellX][this.cellY].delete(this);
    }

    get x() {
        return this._x;
    }

    set x(newX) {
        const previousCellX = this.cellX;
        this._x = newX;
        if (previousCellX != this.cellX) {
            GameObject.objectsGrid[previousCellX][this.cellY].delete(this);
            GameObject.objectsGrid[this.cellX][this.cellY].add(this);
        }
    }

    get y() {
        return this._y;
    }

    set y(newY) {
        const previousCellY = this.cellY;
        this._y = newY;
        if (previousCellY != this.cellY) {
            GameObject.objectsGrid[this.cellX][previousCellY].delete(this);
            GameObject.objectsGrid[this.cellX][this.cellY].add(this);
        }
    }

    get cellX() {
        return Math.floor(this._x / CELL_SIZE)
    }

    get cellY() {
        return Math.floor(this._y / CELL_SIZE)
    }

    get cell() {
        return { x: this.cellX, y: this.cellY }
    }

    getCloseObjectsTo(maxDistance) {
        const centerCell = this.cell;
        const distanceInCells = Math.ceil(maxDistance / CELL_SIZE);
        let closeObjects = []
        for (let i = -distanceInCells; i <= distanceInCells; i++) {
            for (let j = -distanceInCells; j <= distanceInCells; j++) {
                const testedCell = { x: centerCell.x + i, y: centerCell.y + j };
                if (testedCell.x < 0 ||
                    testedCell.y < 0 ||
                    testedCell.x >= GRID_CELLS ||
                    testedCell.y >= GRID_CELLS) {
                    continue;
                }
                closeObjects.push(...GameObject.objectsGrid[testedCell.x][testedCell.y])
            }
        }
        closeObjects = closeObjects.filter((object) => (object != this));
        return closeObjects;
    }
}

module.exports = GameObject;