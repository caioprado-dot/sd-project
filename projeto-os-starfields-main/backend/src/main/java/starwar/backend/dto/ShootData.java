package starwar.backend.dto;

public class ShootData {
    private String playerId;
    private double x;
    private double y;
    private double angle;

    // Construtor vazio necessário para desserialização do JSON
    public ShootData() {}

    public ShootData(String playerId, double x, double y, double angle) {
        this.playerId = playerId;
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getAngle() { return angle; }
    public void setAngle(double angle) { this.angle = angle; }
}

