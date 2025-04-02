import Phaser from "phaser";
import socket from "../services/socket";

export class Spaceship extends Phaser.Physics.Arcade.Sprite {
    private shootKey!: Phaser.Input.Keyboard.Key;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerId: string; 
    constructor(scene: Phaser.Scene, x: number, y: number, playerId: string) {
        super(scene, x, y, "spaceship");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.playerId = playerId; // Armazena o ID do jogador
        this.shootKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursors = scene.input.keyboard!.createCursorKeys();

        this.setScale(0.3);
        this.setCollideWorldBounds(true); // Impede que a nave saia da tela

        if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {

            this.body.setSize(this.width*0.8, this.height*0.8);

            this.body.setBounce(1); // Allow spaceship to bounce

        }
    }

    update() {
        this.move(this.cursors,socket);
        this.shoot(socket);
    }

    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys, socket: any) {
        if (cursors.left.isDown) {
            this.angle -= 2;
            socket.emit("playerMove", { x: this.x, y: this.y, angle: this.angle });
        }
        if (cursors.right.isDown) {
            this.angle += 2;
            socket.emit("playerMove", { x: this.x, y: this.y, angle: this.angle });
        }

        if (cursors.up.isDown) {
            const angleRad = Phaser.Math.DegToRad(this.angle);
            this.x += Math.cos(angleRad) * 5;
            this.x = Phaser.Math.Clamp(this.x, 0, 2000);
            this.y += Math.sin(angleRad) * 5;
            this.y = Phaser.Math.Clamp(this.y, 0, 2000);
            socket.emit("playerMove", { x: this.x, y: this.y, angle: this.angle });
        }
        if (cursors.down.isDown) {
            const angleRad = Phaser.Math.DegToRad(this.angle);
            this.x -= Math.cos(angleRad) * 5;
            this.x = Phaser.Math.Clamp(this.x, 0, 2000);
            this.y -= Math.sin(angleRad) * 5;
            this.y = Phaser.Math.Clamp(this.y, 0, 2000);
            socket.emit("playerMove", { x: this.x, y: this.y, angle: this.angle });
        }
    }

    getPlayerId(): string {
        return this.playerId;
    }

    shoot(socket: any) {
        if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
            console.log("🚀 Disparando projétil!");
            console.log("🔍 Enviando ângulo:", this.angle);
            socket.emit("shootProjectile", {
                playerId: socket.id,
                x: Phaser.Math.Clamp(this.x, 0, 2000),
                y: Phaser.Math.Clamp(this.y, 0, 2000),
                angle: Phaser.Math.Wrap(this.angle, 0, 360)
            });
        }
    }

    takeDamage() {
        console.log(`💥 Nave ${this.playerId} atingida!`);

        this.setTint(0xff0000);
        this.scene.time.delayedCall(500, () => this.setVisible(false));
        this.scene.time.delayedCall(1000, () => {
            this.setVisible(true);
            this.clearTint();
        });
    }
}
