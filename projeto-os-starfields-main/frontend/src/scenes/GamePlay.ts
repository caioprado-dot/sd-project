import Phaser from "phaser";
import { Spaceship } from "../Objects/Espaconave";
import { Projectiles } from "../Objects/Projectile";
import { Asteroids } from "../Objects/Asteroids";
import socket from "../services/socket";

export class GamePlay extends Phaser.Scene {
    private spaceship!: Spaceship;
    //private shootKey!: Phaser.Input.Keyboard.Key;
    private projectiles!: Projectiles; 
    private asteroids!: Asteroids;
    private players: { [id: string]: Phaser.GameObjects.Sprite } = {};
    private scoreBoard : { [key: string]: number } = {};
    private scoreText!: Phaser.GameObjects.Text;
    private playerScore = 0;

    constructor() {
        super("GamePlay"); 
    }
 
    preload() {
        this.load.image("spaceship", "/assets/Espaconave.png");
        this.load.image("projectile", "/assets/projetil.png");
        this.load.image("asteroid", "/assets/Asteroid.png");
        this.load.image("background", "/assets/espacosideral.jpg");
    }

    create() {
        this.add.tileSprite(1000, 1000, 2000, 2000, "background");
        this.physics.world.setBounds(0,0,2000,2000);
        this.cameras.main.setBounds(0,0,2000,2000);

        const debugGraphic = this.physics.world.createDebugGraphic();
        debugGraphic.clear();
        debugGraphic.setVisible(true);

        this.spaceship = new Spaceship(this, 1000, 1000, socket.id);
        this.spaceship.setImmovable(true);
        this.players[socket.id] = this.spaceship;
        
        this.cameras.main.startFollow(this.spaceship);
        
        this.projectiles = new Projectiles(this);
        this.add.existing(this.projectiles);
        
        this.asteroids = new Asteroids(this);
        this.add.existing(this.asteroids);

        this.scoreBoard[socket.id] = 0;

        // Cria o objeto de texto para exibir pontuação
        this.scoreText = this.add.text(16, 16, "Pontos: 0", {
            fontSize: "32px",
            color: "#fff",
        });
        this.scoreText.setScrollFactor(0);
        
        //this.cursors = this.input.keyboard!.createCursorKeys();


        //socket.emit("playerMove", { x: this.spaceship.x, y: this.spaceship.y, angle: this.spaceship.angle });
        socket.emit("getListPlayer");
        socket.emit("getAsteroids");

        socket.on("getListPlayer", (data: { [id: string]: { x: number; y: number; angle: number } }) => {
            console.log("📡 Lista de Jogadores", data);

            Object.entries(data).forEach(([id, position]) => {
                if (!this.players[id]) {
                    this.players[id] = this.physics.add.sprite(position.x, position.y, "spaceship").setScale(0.3);
                    this.players[id].angle = position.angle;
                    
                } else {
                    console.warn(`❌ Jogador ${id} não encontrado!`);
                }
            });
        });

        socket.on("newPlayer", (data: { id: string; x: number; y: number; angle: number }) => {
            console.log("📡 New jogador", data);
            if (!this.players[data.id]) {
                this.players[data.id] = this.physics.add.sprite(data.x, data.y, "spaceship").setScale(0.3);
                this.players[data.id].angle = data.angle;
                this.scoreBoard[data.id] = 0;
            }
        });

        socket.on("spawnProjectile", (data: { playerId: string, x: number; y: number; angle: number }) => {
            console.log("✅ Conectado ao servidor, ouvindo spawnProjectiles...");
            this.projectiles.spawnProjectile(data.x, data.y, data.angle, data.playerId);
        });

        socket.on("updateAsteroids", (data:{x:number,y:number, velocityX: number, velocityY: number}[]) => {
            console.log("Evento de Asteroid", data);
            data.forEach(asteroide => {
                this.asteroids.spawnAsteroid(asteroide.x, asteroide.y, asteroide.velocityX, asteroide.velocityY);
            });
        });
        

        socket.on("updatePlayers", (data: { [id: string]: { x: number; y: number; angle: number } }) => {
            console.log("📡 Atualizando posições dos jogadores:", data);

            Object.entries(data).forEach(([id, position]) => {
                if (this.players[id]) {
                    this.players[id].setPosition(position.x, position.y);
                    this.players[id].setAngle(position.angle);
                } else {
                    console.warn(`❌ Jogador ${id} não encontrado!`);
                }
            });
        });

        socket.on(
          'playerGotHitBC',
          (data: {
            shooter_id: string;
            got_shot_id: string;
            shooter_updated_score: number;
          }) => {
            this.scoreBoard[data.shooter_id] = data.shooter_updated_score;
            if(this.spaceship.getPlayerId() === data.shooter_id){
                this.playerScore = data.shooter_updated_score;
                this.scoreText.setText("Pontos: " + this.playerScore);
                
            } 
            for (let key in this.scoreBoard) {
              if (this.scoreBoard.hasOwnProperty(key)) {
                console.log(`${key}: ${this.scoreBoard[key]}`);
              }
            }
          }
        );

        socket.on("playerLeft", (id: string) => {
            if (this.players[id]) {
                this.players[id].destroy();
                delete this.players[id];
            }
        });

        // Colisão entre inimigos e o player
        this.physics.add.collider(
            this.spaceship,
            this.projectiles,
            (spaceship, projectile) => this.handleCollision(spaceship as Spaceship, projectile as Phaser.Physics.Arcade.Sprite),
            undefined,
            this
        );

        this.physics.add.collider(
            this.spaceship,
            this.asteroids,
            (spaceship, asteroid) => this.handleAsteroidCollision(spaceship as Spaceship, asteroid as Phaser.Physics.Arcade.Sprite),
            undefined,
            this
        );
        
        

        }

        handleCollision(spaceship: Spaceship, projectile: Phaser.Physics.Arcade.Sprite & { idNave?: string }) {
            if (!projectile.active || (spaceship.getPlayerId() === projectile.idNave)) return;
            console.log("📡 ATINGIU");
            
            projectile.setActive(false).setVisible(false);
            if(projectile.body instanceof Phaser.Physics.Arcade.Body){
                projectile.body.setVelocity(0, 0);
                projectile.setPosition(2200, 2200);}

            spaceship.takeDamage(socket, projectile.idNave);
        }

        handleAsteroidCollision(spaceship: Spaceship, asteroid: Phaser.Physics.Arcade.Sprite) {
            console.log("🚀 Nave colidiu com um asteroide!");

            // Reduz a vida da nave
            spaceship.takeDamage();

            // Simular destruição do asteroide
            asteroid.setActive(false).setVisible(false);
        }
    
    
    update() {
        if (!this.spaceship) return;
        this.spaceship.update();
        this.asteroids.update();
        this.scoreText.update()
    }

}
