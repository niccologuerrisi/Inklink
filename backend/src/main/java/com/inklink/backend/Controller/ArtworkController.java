package com.inklink.backend.controller;

import com.inklink.backend.model.Artwork;
import com.inklink.backend.service.ArtworkService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    private final ArtworkService service;

    public ArtworkController(ArtworkService artworkService){
        this.service = artworkService;
    }

    @PostMapping("/upload")
    public Artwork uploadArtwork(@RequestParam Long purchaseId, @RequestParam String fileUrl) {
        return service.uploadArtwork(purchaseId, fileUrl);
    }
}