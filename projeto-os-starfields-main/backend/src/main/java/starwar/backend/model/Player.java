package starwar.backend.model;

import jakarta.persistence.*;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Gera um ID único automaticamente
    private Long id; // Identificador do jogador

    private int x;
    private int y;
    private int angle;

    public Player() {}

    public Player(int x, int y, int angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    public int getX() { return x; }
    public void setX(int x) { this.x = x; }

    public int getY() { return y; }
    public void setY(int y) { this.y = y; }

    public int getAngle() { return angle; }
    public void setAngle(int angle) { this.angle = angle; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Override
    public String toString() {
        return "Player{id=" + id + ", x=" + x + ", y=" + y + ", angle=" + angle + "}";
    }
}
