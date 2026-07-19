package com.inklink.backend.repository;
import com.inklink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

//è la user repository, dato che abbiamo usato long come tipo per l'id di user, useremo long anche qui
public interface UserRepository extends JpaRepository<User, Long>
{
    boolean existsByMail(String mail);
    Optional<User> findByMail(String mail);
}