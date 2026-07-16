package com.inklink.backend.controller;

import com.inklink.backend.model.User;
import com.inklink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

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
    //@RequestBody User user dice a Spring di prendere il file JSON che arriva nel corpo
    //della richiesta e di convertirlo in un oggetto user

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PostMapping("/{id}/activate-artist")
    public void activateArtist(@PathVariable Long id) {
        service.activateAsArtist(id);
    }
}