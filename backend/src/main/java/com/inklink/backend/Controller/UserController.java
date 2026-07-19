package com.inklink.backend.controller;
import com.inklink.backend.model.User;
import com.inklink.backend.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController
{

    private final UserService service;

    public UserController(UserService service) {this.service = service;}

    @PostMapping //rispone alle richieste HTTP di tipo POST sull'URL base
    public User registerUser(@RequestBody User user) {
        return service.registerUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }
    //@RequestBody User user dice a Spring di prendere il file JSON che arriva nel corpo
    //della richiesta e di convertirlo in un oggetto user

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PostMapping("/activate-artist")
    public void activateArtist() {
        String mail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = service.getUserByMail(mail);
        service.activateAsArtist(user.getId());
    }
}