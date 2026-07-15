package com.inklink.backend.service;
import com.inklink.backend.repository.PortfolioItemRepository;
import org.springframework.stereotype.Service;
import com.inklink.backend.model.PortfolioItem;
import com.inklink.backend.model.User;
import java.util.List;

@Service
public class PortfolioItemService
{
    private final PortfolioItemRepository repository;

    public PortfolioItemService(PortfolioItemRepository repository) {this.repository = repository;}

    public PortfolioItem addPortfolioItem(User owner, String fileUrl, String title, String description)
    {
        PortfolioItem item = new PortfolioItem();
        item.setOwner(owner);
        item.setFileURL(fileUrl);
        item.setTitle(title);
        item.setDescription(description);
        return repository.save(item);
    }

    public List<PortfolioItem> getPortfolioByOwner(Long ownerId) {
        return repository.findByOwnerId(ownerId);
    }
}