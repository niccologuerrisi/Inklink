package com.inklink.backend.controller;
import com.inklink.backend.model.Slot;
import com.inklink.backend.model.SlotStatus;
import com.inklink.backend.model.User;
import com.inklink.backend.service.SlotService;
import com.inklink.backend.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotController {
    private final SlotService service;
    private final UserService userService;

    public SlotController(SlotService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public Slot getSlot(@PathVariable Long id) {
        return service.getSlotById(id);
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
        String mail = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userService.getUserByMail(mail);
        service.updatePrice(slotId, newPrice, requester);
    }
}