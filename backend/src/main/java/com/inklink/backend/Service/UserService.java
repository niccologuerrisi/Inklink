package com.inklink.backend.service;
import com.inklink.backend.model.User;
import com.inklink.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService
{
    private final UserRepository repository;
    private final SlotService slotService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, SlotService slotService, PasswordEncoder passwordEncoder)
    {
        this.repository = repository;
        this.slotService = slotService;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User newUser)
    {
        if (newUser.getName() == null || newUser.getName().isBlank()
                || newUser.getSurname() == null || newUser.getSurname().isBlank()
                || newUser.getMail() == null || newUser.getMail().isBlank()
                || newUser.getPassword() == null || newUser.getPassword().isBlank())
        {
            throw new RuntimeException("Nome, cognome, email e password sono obbligatori");
        }
        if (repository.existsByMail(newUser.getMail())) {
            throw new RuntimeException("Email già registrata");
        }
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        return repository.save(newUser);
    }

    public User getUserById(Long id)
    {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
    }

    public List<User> getAllUsers()
    {
        return repository.findAll();
    }

    //quando un utente che originariamente era un no artista decide di diventare artista
    //il suo profilo verrà cambiato come artista e gli slot diventeranno disponibili
    public void activateAsArtist(Long userId)
    {
        User user = getUserById(userId);
        if (!user.getSlots().isEmpty())
            throw new RuntimeException("Utente già attivo come artista");
        slotService.createDefaultSlots(user);
    }

    public User getUserByMail(String mail) {
        return repository.findByMail(mail)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
    }
}