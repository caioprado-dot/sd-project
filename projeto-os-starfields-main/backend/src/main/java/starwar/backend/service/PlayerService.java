package starwar.backend.service;

import org.springframework.stereotype.Service;
import starwar.backend.dto.PlayerPosition;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PlayerService {
    private final Map<String, PlayerPosition> players = new ConcurrentHashMap<>();

    public void addPlayer(String playerId) {
        Random random = new Random();

        int maxX = 2000;
        int maxY = 2000;
        int minDistance = 100;
        int randomX, randomY;
        boolean positionOccupied;

        do {
            randomX = random.nextInt(maxX);
            randomY = random.nextInt(maxY);
            positionOccupied = false;

            for (PlayerPosition player : players.values()) {
                double distance = Math.sqrt(Math.pow(player.getX() - randomX, 2) + Math.pow(player.getY() - randomY, 2));
                if (distance < minDistance) {
                    positionOccupied = true;
                    break;
                }
            }
        } while (positionOccupied);
        players.put(playerId, new PlayerPosition(randomX, randomY, 0));
    }

    public void removePlayer(String playerId) {
        players.remove(playerId);
    }

    public void updatePlayerPosition(String playerId, String direction) {
        PlayerPosition player = players.get(playerId);
        if (player == null) return;

        double angleRad = Math.toRadians(player.getAngle());
        double speed = 5.0;

        switch (direction) {
            case "left":
                player.setAngle(player.getAngle() - 2);
                break;
            case "right":
                player.setAngle(player.getAngle() + 2);
                break;
            case "up":
                player.setX((int) (Math.max(0, Math.min(2000, player.getX() + Math.cos(angleRad) * speed))) );
                player.setY((int) (Math.max(0, Math.min(2000, player.getY() + Math.sin(angleRad) * speed))) );
                break;
            case "down":
                player.setX((int) (Math.max(0, Math.min(2000, player.getX() - Math.cos(angleRad) * speed))) );
                player.setY((int) (Math.max(0, Math.min(2000, player.getY() - Math.sin(angleRad) * speed))) );
                break;
        }
    }

    public Map<String, PlayerPosition> getAllPlayers() {
        return players;
    }

    public PlayerPosition getPlayer(String playerId){
        return players.get(playerId);

    }
}