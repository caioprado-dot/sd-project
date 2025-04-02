package starwar.backend.config;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.Transport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.corundumstudio.socketio.listener.DataListener;
import org.springframework.scheduling.annotation.Scheduled;

import starwar.backend.dto.PlayerPosition;
import starwar.backend.dto.ShootData;

import starwar.backend.service.AsteroideService;
import starwar.backend.dto.AsteroideDTO;
import java.util.List;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;


import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SocketIOConfig {

    private final Map<String, PlayerPosition> players = new ConcurrentHashMap<>();
    private final AsteroideService asteroideService;

    public SocketIOConfig(AsteroideService asteroideService) {
        this.asteroideService = asteroideService;
    }

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();

        config.setHostname("0.0.0.0"); // ✅ Permite conexões externas
        config.setPort(9092);

        config.setTransports(Transport.WEBSOCKET, Transport.POLLING);
        config.setOrigin("*"); // Permite qualquer origem (ajustar conforme necessário)
        config.setAuthorizationListener(data -> {
            System.out.println("🔓 Conexão autorizada: " + data.getAddress());
            return true;
        });

        final SocketIOServer server = new SocketIOServer(config);

        server.addConnectListener(client -> {
            System.out.println("🔗 Novo jogador conectado: " + client.getSessionId());

            // Criar jogador na posição inicial
            PlayerPosition newPlayer = new PlayerPosition(400, 300, 0);
            players.put(client.getSessionId().toString(), newPlayer);

            System.out.println("📜 Lista de jogadores no servidor: " + players + " / " + client.getSessionId());

            // Enviar para todos os jogadores que um novo jogador entrou
            server.getBroadcastOperations().sendEvent("newPlayer", Map.of(
                    "id", client.getSessionId().toString(),
                    "x", newPlayer.getX(),
                    "y", newPlayer.getY()),
                    "angle", newPlayer.getAngle()
            );

            server.getBroadcastOperations().sendEvent("updateAsteroids", asteroideService.getAsteroids());
        });

        server.addEventListener("getAsteroids", AsteroideDTO.class, (client, data, ackSender) -> {
            List<AsteroideDTO> asteroids = asteroideService.getAsteroids();
            System.out.println("AsteroideDTO: " + asteroids + " Cliente " + client.getSessionId().toString());
            client.sendEvent("updateAsteroids", asteroids);
        });

        // ✅ Quando um jogador se move, atualizamos a posição no mapa
        server.addEventListener("playerMove", PlayerPosition.class, (client, data, ackSender) -> {
            System.out.println("🚀 Jogador moveu para: " + data.getX() + ", " + data.getY());

            // Atualiza a posição do jogador no mapa
            players.put(client.getSessionId().toString(), data);

            // Envia a nova posição para todos
            server.getBroadcastOperations().sendEvent("updatePlayers", players);
        });

        server.addEventListener("getListPlayer", PlayerPosition.class, (client, data, ackSender) -> {
            // Envia a nova posição para todos
            client.sendEvent("getListPlayer", players);
        });

        server.addEventListener("shootProjectile", ShootData.class, (client, data, ackSender) -> {
            System.out.println("🔍 Recebido ângulo: " + data.getAngle());
            System.out.println("🚀 Jogador " + data.getPlayerId() + " atirou!");

            // Reenviar para todos os jogadores para que o projétil apareça na tela deles
            server.getBroadcastOperations().sendEvent("spawnProjectile", data);
        });

        // ✅ Quando um jogador se desconecta, removemos ele do mapa
        server.addDisconnectListener(client -> {
            System.out.println("❌ Jogador desconectado: " + client.getSessionId());
            players.remove(client.getSessionId().toString());

            // Notificar todos os jogadores que ele saiu
            server.getBroadcastOperations().sendEvent("playerLeft", client.getSessionId().toString());
        });

        return server;
    }

    @Scheduled(fixedRate = 1000) // Atualiza a posição dos asteroides a cada 1 segundo
    public synchronized void updateAsteroids() { // Exclusão mútua aqui
        asteroideService.updateAsteroids(); // Atualiza posições
        List<AsteroideDTO> asteroids = asteroideService.getAsteroids();
        socketIOServer().getBroadcastOperations().sendEvent("updateAsteroids", asteroids);
    }
}
