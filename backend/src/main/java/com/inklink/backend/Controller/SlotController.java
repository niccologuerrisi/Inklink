package com.inklink.backend.controller;

import com.inklink.backend.model.Slot;
import com.inklink.backend.model.SlotStatus;
import com.inklink.backend.service.SlotService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {

    private final SlotService service;

    public SlotController(SlotService service) {
        this.service = service;
    }

    @GetMapping("/artist/{artistId}")
    public List<Slot> getSlotsByArtist(@PathVariable Long artistId) {
        return service.getSlotsByArtist(artistId);
    }

    @GetMapping("/artist/{artistId}/status/{status}")
    public List<Slot> getSlotsByArtistAndStatus(@PathVariable Long artistId, @PathVariable SlotStatus status) {
        return service.getSlotsByArtistAndStatus(artistId, status);
    }

    @PutMapping("/{slotId}/price")
    public void updatePrice(@PathVariable Long slotId, @RequestParam Double newPrice) {
        service.updatePrice(slotId, newPrice);
    }
}