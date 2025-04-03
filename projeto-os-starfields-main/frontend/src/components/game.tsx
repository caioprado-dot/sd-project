import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import socket from "../services/socket";
import { GamePlay } from "../scenes/GamePlay";

const Game: React.FC = () => {
    const gameContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!gameContainer.current) return;

      let players: { [id: string]: Phaser.GameObjects.Image } = {};
      let spaceship: Phaser.GameObjects.Image;
      let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
      let asteroids: Phaser.Physics.Arcade.Group;
      

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainer.current,
        physics: {
          default: 'arcade',
          arcade: { gravity: { y: 0, x: 0 } },
        },
        scene: [GamePlay],
      };

      const game = new Phaser.Game(config);

      return () => {
        game.destroy(true);
      };
    }, []);

    return <div ref={gameContainer} style={{ width: "800px", height: "600px" }} />;
};

export default Game;