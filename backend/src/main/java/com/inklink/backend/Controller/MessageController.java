package com.inklink.backend.controller;

import com.inklink.backend.model.Message;
import com.inklink.backend.model.Purchase;
import com.inklink.backend.model.User;
import com.inklink.backend.service.MessageService;
import com.inklink.backend.service.PurchaseService;
import com.inklink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService service;
    private final PurchaseService purchaseService;
    private final UserService userService;

    public MessageController(MessageService messageService, PurchaseService purchaseService, UserService userService){
        this.service = messageService;
        this.purchaseService = purchaseService;
        this.userService = userService;
    }

    @PostMapping("/send")
    public Message sendMessage(@RequestParam Long purchaseId, @RequestParam Long senderId, @RequestParam String text)
    {
        Purchase purchase = purchaseService.getPurchaseById(purchaseId);
        User user = userService.getUserById(senderId);
        return service.sendMessage(purchase, user, text);
    }

    @GetMapping("/purchase/{purchaseId}")
    public List<Message> getMessagesByPurchase(@PathVariable Long purchaseId) {
        return service.getMessagesByPurchase(purchaseId);
    }
}