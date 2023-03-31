class GameObject {
    static objects = []

    constructor(x, y) {
        this.x = x;
        this.y = y;
        GameObject.objects.push(this);
    }


}

module.exports = GameObject;