package com.inklink.backend.controller;

import com.inklink.backend.model.Purchase;
import com.inklink.backend.model.User;
import com.inklink.backend.service.PurchaseService;
import com.inklink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService service;
    private final UserService userService;

    public PurchaseController(PurchaseService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping("/buy")
    public Purchase buySlot(@RequestParam Long slotId) {
        String mail = SecurityContextHolder.getContext().getAuthentication().getName();
        User buyer = userService.getUserByMail(mail);
        return service.buySlot(slotId, buyer);
    }

    @PostMapping("/{purchaseId}/complete")
    public Purchase completePurchase(@PathVariable Long purchaseId) {return service.completePurchase(purchaseId);}

    @GetMapping("/{id}")
    public Purchase getPurchase(@PathVariable Long id) {return service.getPurchaseById(id);}
}