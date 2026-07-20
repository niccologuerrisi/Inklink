package com.inklink.backend.controller;
import com.inklink.backend.model.Artwork;
import com.inklink.backend.model.User;
import com.inklink.backend.service.ArtworkService;
import com.inklink.backend.service.FileStorageService;
import com.inklink.backend.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {
    private final ArtworkService service;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public ArtworkController(ArtworkService artworkService, UserService userService,
                             FileStorageService fileStorageService){
        this.service = artworkService;
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public Artwork uploadArtwork(@RequestParam Long purchaseId, @RequestParam MultipartFile file) {
        String mail = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userService.getUserByMail(mail);
        String fileUrl = fileStorageService.store(file);
        return service.uploadArtwork(purchaseId, fileUrl, requester);
    }
}