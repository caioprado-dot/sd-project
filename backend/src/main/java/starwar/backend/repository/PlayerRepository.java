package starwar.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import starwar.backend.model.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {}
