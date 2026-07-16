package com.inklink.backend.controller;
import com.inklink.backend.model.PortfolioItem;
import com.inklink.backend.model.User;
import com.inklink.backend.service.PortfolioItemService;
import com.inklink.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/portfolioItems")
public class PortfolioItemController {

    private final PortfolioItemService service;
    private final UserService userService;

    public PortfolioItemController(PortfolioItemService portfolioItemService, UserService userService){
        this.service = portfolioItemService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public PortfolioItem addPortfolioItem(@RequestParam Long ownerId, @RequestParam String fileUrl,
                                          @RequestParam String title, @RequestParam String description)
    {
        User owner = userService.getUserById(ownerId);
        return service.addPortfolioItem(owner, fileUrl, title, description);
    }

    @GetMapping("/owner/{ownerId}")
    public List<PortfolioItem> getPortfolioByOwner(@PathVariable Long ownerId) {
        return service.getPortfolioByOwner(ownerId);
    }
}