package starwar.backend.dto;

import starwar.backend.model.Player;
import starwar.backend.dto.PlayerPosition;
import starwar.backend.dto.ShootData;
//import starwar.backend.dto.AsteroidData;

public class CollisionManager {
    private ShootData shootData;
    private PlayerPosition playerPosition;
    private Player player;
    //private AsteroidData asteroidData;

    public CollisionManager() {}

    public CollisionManager(ShootData shootData, PlayerPosition playerPosition) {
        this.shootData = (shootData != null) ? shootData : new ShootData();
        this.playerPosition = (playerPosition != null) ? playerPosition : new PlayerPosition();
    }

    /*public CollisionManager(ShootData shootData, AsteroidData asteroidData, Player player) {
        this.shootData = shootData;
        this.asteroidData = asteroidData;
        this.player = player;
    }*/

    public ShootData getShootData() {
        return shootData;
    }

    public void setShootData(ShootData shootData) {
        this.shootData = shootData;
    }

    public PlayerPosition getPlayerPosition() {
        return playerPosition;
    }

    public void setPlayerPosition(PlayerPosition playerPosition) {
        this.playerPosition = playerPosition;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    /*public AsteroidData getAsteroidData() {
        return asteroidData;
    }

    public void setAsteroidData(AsteroidData asteroidData) {
        this.asteroidData = asteroidData;
    }*/
}

