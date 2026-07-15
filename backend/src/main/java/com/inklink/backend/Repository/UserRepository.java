package com.inklink.backend.repository;
import com.inklink.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

//è la user repository, dato che abbiamo usato long come tipo per l'id di user, useremo long anche qui
public interface UserRepository extends JpaRepository<User, Long> {
}