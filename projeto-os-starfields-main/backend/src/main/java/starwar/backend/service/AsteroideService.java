package starwar.backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import starwar.backend.dto.AsteroideDTO;

@Service
public class AsteroideService {
    private final List<AsteroideDTO> asteroids = new ArrayList<>();
    private final Random random = new Random();

    public List<AsteroideDTO> getAsteroids() {
        return asteroids;
    }

    public void spawnAsteroid() {
        if (asteroids.size() >= 10) {
            return; // Remove o primeiro (mais antigo) para dar espaço a um novo
        }

        double x = random.nextInt(2000); // Posição inicial aleatória
        double y = random.nextInt(2000);
        double velocityX = random.nextDouble() * 200 - 100; // Velocidade entre -100 e 100
        double velocityY = random.nextDouble() * 200 - 100;

        AsteroideDTO asteroid = new AsteroideDTO(x, y, velocityX, velocityY);
        asteroids.add(asteroid);
    }

    public void updateAsteroids() {
        for (AsteroideDTO asteroid : asteroids) {
            asteroid.x += asteroid.velocityX * 0.016; // Simulação de deslocamento a cada frame (~16ms)
            asteroid.y += asteroid.velocityY * 0.016;
        }
    }

    @Scheduled(fixedRate = 5000) // Gera um novo asteroide a cada 5 segundos
    public void generateAsteroids() {
        System.out.println("Gerando novo asteroide...");
        spawnAsteroid();
    }
}