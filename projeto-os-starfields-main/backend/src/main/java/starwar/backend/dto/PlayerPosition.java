package starwar.backend.dto;

public class PlayerPosition {
    private int x;
    private int y;
    private int angle;

    public PlayerPosition() {}

    public PlayerPosition(int x, int y, int angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    public int getX() { return x; }
    public void setX(int x) { this.x = x; }

    public int getAngle() { return angle; }
    public void setAngle(int angle) { this.angle = angle; }

    public int getY() { return y; }
    public void setY(int y) { this.y = y; }

    @Override
    public String toString() {
        return "PlayerPosition{x=" + x + ", y=" + y + "}";
    }
}
