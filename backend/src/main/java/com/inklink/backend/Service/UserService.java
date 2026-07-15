package com.inklink.backend.service;
import com.inklink.backend.model.User;
import com.inklink.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService
{
    private final UserRepository repository;
    private final SlotService slotService;

    public UserService(UserRepository repository, SlotService slotService)
    {
        this.repository = repository;
        this.slotService = slotService;
    }

    public User registerUser(User newUser)
    {
        if (repository.existsByMail(newUser.getMail())) {
            throw new RuntimeException("Email già registrata");
        }
        return repository.save(newUser);
    }

    public User getUserById(Long id)
    {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
    }

    //quando un utente che originariamente era un no artista decide di diventare artista
    //il suo profilo verrà cambiato come artista e gli slot diventeranno disponibili
    public void activateAsArtist(Long userId)
    {
        User user = getUserById(userId);
        slotService.createDefaultSlots(user);
    }
}