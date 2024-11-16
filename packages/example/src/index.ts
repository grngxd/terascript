class MySprite extends Sprite {
    constructor() {
        super();
        this.x = 10;
        this.y = 20;
    }
}

const mySprite = new MySprite();
mySprite.say("Hello, world!");