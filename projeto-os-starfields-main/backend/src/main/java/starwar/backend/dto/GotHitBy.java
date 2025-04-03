package starwar.backend.dto;

public class GotHitBy {
    private String playerId;
    private String hitBy;

    // Construtor vazio necessário para desserialização do JSON
    public GotHitBy() {}

    public GotHitBy(String playerId, String hitBy) {
        this.playerId = playerId;
        this.hitBy = hitBy;
    }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public String getHitBy() { return hitBy; }
    public void setHitBy(String enemyId) { this.hitBy = enemyId; }
}
