package starwar.backend.dto;

public class AsteroideDTO {
    public double x;
    public double y;
    public double velocityX;
    public double velocityY;

    public AsteroideDTO(double x, double y, double velocityX, double velocityY) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getVelocityX() { return velocityX; }
    public void setVelocityX(double velocityX) { this.velocityX = velocityX; }

    public double getVelocityY() { return velocityY; }
    public void setVelocityY(double velocityY) { this.velocityY = velocityY; }

    @Override
    public String toString() {
        return "AsteroideDTO{x=" + x + ", y=" + y + ", velocityX=" + velocityX + ", velocityY=" + velocityY + "}";
    }
}