package com.inklink.backend.controller;

import com.inklink.backend.model.Purchase;
import com.inklink.backend.model.User;
import com.inklink.backend.service.PurchaseService;
import com.inklink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

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
    public Purchase buySlot(@RequestParam Long slotId, @RequestParam Long buyerId) {
        User buyer = userService.getUserById(buyerId);
        return service.buySlot(slotId, buyer);
    }

    @PostMapping("/{purchaseId}/complete")
    public Purchase completePurchase(@PathVariable Long purchaseId) {return service.completePurchase(purchaseId);}
}