package com.inklink.backend.controller;
import com.inklink.backend.model.Artwork;
import com.inklink.backend.model.User;
import com.inklink.backend.service.ArtworkService;
import com.inklink.backend.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {
    private final ArtworkService service;
    private final UserService userService;

    public ArtworkController(ArtworkService artworkService, UserService userService){
        this.service = artworkService;
        this.userService = userService;
    }

    @PostMapping("/upload")
    public Artwork uploadArtwork(@RequestParam Long purchaseId, @RequestParam String fileUrl) {
        String mail = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userService.getUserByMail(mail);
        return service.uploadArtwork(purchaseId, fileUrl, requester);
    }
}