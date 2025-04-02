import Phaser from "phaser";

export class Asteroids extends Phaser.Physics.Arcade.Group{

    constructor(scene: Phaser.Scene) {

        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Phaser.Physics.Arcade.Sprite,
            key: "asteroid",
            quantity: 10,
            active: false,
            visible: false,
            setXY: { x: -100, y: -100 }
        });

    }

    spawnAsteroid(x: number, y: number, velocityX: number, velocityY: number) {
        const asteroid = this.getFirstDead(false, x, y, "asteroid") as Phaser.Physics.Arcade.Sprite;
        console.log("bora ver: ", asteroid);

        if (asteroid && asteroid.body instanceof Phaser.Physics.Arcade.Body) {
            console.log("Asteroid A", asteroid);
            asteroid.setScale(0.08);
            const radius = (asteroid.width * asteroid.scaleX) / 2;
            asteroid.body.setCircle(radius);
            asteroid.body.offset.x = asteroid.width / 2 - radius;
            asteroid.body.offset.y = asteroid.height / 2 - radius;

            asteroid.setActive(true);
            asteroid.setVisible(true);

            asteroid.body.setVelocity(velocityX, velocityY);

            asteroid.setCollideWorldBounds(true);
            asteroid.setBounce(1);

        }
    }

    update() {
        this.children.iterate((asteroid: Phaser.GameObjects.GameObject | null) => {
            if (asteroid && asteroid instanceof Phaser.Physics.Arcade.Sprite) {
                if (asteroid.x < 0 || asteroid.x > 2000 || asteroid.y < 0 || asteroid.y > 2000) {
                    asteroid.setActive(false);
                    asteroid.setVisible(false);
                }
            }
            return null;
        });
    }
}

