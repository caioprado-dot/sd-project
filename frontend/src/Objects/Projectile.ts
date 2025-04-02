import Phaser from "phaser";

export class Projectiles extends Phaser.Physics.Arcade.Group{

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene, {
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 2, // Limite de projéteis simultâneos
            runChildUpdate: true
        });
        
        this.createMultiple({//Filhos "projectile"
            classType: Phaser.Physics.Arcade.Sprite, 
            key: "projectile", 
            repeat: 1, 
            active: false,
            visible: false,
            setXY: { x: -100, y: 1000 } 
        });

        this.children.iterate((projectile) => {
            if (projectile instanceof Phaser.Physics.Arcade.Sprite) {
                //projectile.setBounce(1);
                this.scene.physics.world.enable(projectile);
                if(projectile.body){
                projectile.body.setCircle(projectile.width / 6);}

                projectile.setOrigin(0.5, 0.5);
                projectile.setActive(false).setVisible(false);
                
            }
            return null;
        });

    }

    spawnProjectile(x: number, y: number, angle: number, idNave: string) {
         const projectile = this.getFirstDead(false) as Phaser.Physics.Arcade.Sprite & { idNave?: string };

        if (projectile) {
            projectile.setActive(true).setVisible(true);
            projectile.setPosition(x, y);
            projectile.idNave = idNave;
            projectile.setRotation(Phaser.Math.DegToRad(angle));

            // Aplicar velocidade na direção da nave
            if (projectile.body instanceof Phaser.Physics.Arcade.Body) {
                this.scene.physics.velocityFromRotation(projectile.rotation, 500, projectile.body.velocity);
            }

            // Desativar o projétil após 3 segundos
            this.scene.time.delayedCall(3000, () => {
                projectile.setActive(false).setVisible(false);
                if (projectile.body instanceof Phaser.Physics.Arcade.Body) {
                    projectile.body.setVelocity(0, 0);
                }
            });
        } else {
            console.log("⚠️ Sem projéteis disponíveis para reutilização!");
        }
    }
}
