import Phaser from "phaser";
import socket from "../services/socket";

export class Spaceship extends Phaser.Physics.Arcade.Sprite {
  private shootKey!: Phaser.Input.Keyboard.Key;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerId: string;
  constructor(scene: Phaser.Scene, x: number, y: number, playerId: string) {
    super(scene, x, y, 'spaceship');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.playerId = playerId; // Armazena o ID do jogador
    this.shootKey = scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.cursors = scene.input.keyboard!.createCursorKeys();

    this.setScale(0.3);
    this.setCollideWorldBounds(true); // Impede que a nave saia da tela

    if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setSize(this.width * 0.8, this.height * 0.8);

      this.body.setBounce(1); // Allow spaceship to bounce
    }
  }

  update() {
    this.move(this.cursors, socket);
    this.shoot(socket);
  }
    
    move(cursors: Phaser.Types.Input.Keyboard.CursorKeys, socket: any) {
        if (cursors.left.isDown) {
            socket.emit("playerMove", "left");
        }
        if (cursors.right.isDown) {
            socket.emit("playerMove", "right");
        }
        if (cursors.up.isDown) {
            socket.emit("playerMove", "up");
        }
        if (cursors.down.isDown) {
            socket.emit("playerMove", "down");
        }
    }

  getPlayerId(): string {
    return this.playerId;
  }

  shoot(socket: any) {
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      socket.emit('shootProjectile', {
        playerId: socket.id,
        x: Phaser.Math.Clamp(this.x, 0, 2000),
        y: Phaser.Math.Clamp(this.y, 0, 2000),
        angle: Phaser.Math.Wrap(this.angle, 0, 360),
      });
      console.log('🚀 Disparando projétil!');
      console.log('🔍 Enviando ângulo:', this.angle);
    }
  }

  takeDamage(socket?: any, enemyId?:any) {
    console.log(`💥 Nave ${this.playerId} atingida!`);
    if(enemyId){
      socket.emit('playerGotHit', { playerId: socket.id, hitBy: enemyId });
    }else{
      console.log('Foi atingida por um meteoro');
    }

    this.setTint(0xff0000);
    this.scene.time.delayedCall(500, () => this.setVisible(false));
    this.scene.time.delayedCall(1000, () => {
      this.setVisible(true);
      this.clearTint();
    });
  }
}
