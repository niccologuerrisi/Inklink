package com.inklink.backend.service;
import com.inklink.backend.model.Message;
import com.inklink.backend.model.Purchase;
import com.inklink.backend.model.User;
import com.inklink.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class MessageService
{
    private final MessageRepository repository;

    public MessageService(MessageRepository repository) {this.repository = repository;}

    public Message sendMessage(Purchase purchase, User sender, String text) {
        Message message = new Message();
        message.setPurchase(purchase);
        message.setSender(sender);
        message.setText(text);
        return repository.save(message);
    }

    public List<Message> getMessagesByPurchase(Long purchaseId) {
        return repository.findByPurchaseId(purchaseId);
    }

}