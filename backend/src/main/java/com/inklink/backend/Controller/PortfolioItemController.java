package com.inklink.backend.controller;
import com.inklink.backend.model.PortfolioItem;
import com.inklink.backend.model.User;
import com.inklink.backend.service.FileStorageService;
import com.inklink.backend.service.PortfolioItemService;
import com.inklink.backend.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/portfolioItems")
public class PortfolioItemController {
    private final PortfolioItemService service;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public PortfolioItemController(PortfolioItemService portfolioItemService, UserService userService,
                                   FileStorageService fileStorageService){
        this.service = portfolioItemService;
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public PortfolioItem addPortfolioItem(@RequestParam MultipartFile file,
                                          @RequestParam String title, @RequestParam String description)
    {
        String mail = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userService.getUserByMail(mail);
        String fileUrl = fileStorageService.store(file);
        return service.addPortfolioItem(owner, fileUrl, title, description);
    }

    @GetMapping("/owner/{ownerId}")
    public List<PortfolioItem> getPortfolioByOwner(@PathVariable Long ownerId) {
        return service.getPortfolioByOwner(ownerId);
    }
}