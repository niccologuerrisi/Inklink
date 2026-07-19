package com.inklink.backend.controller;
import com.inklink.backend.model.Review;
import com.inklink.backend.model.User;
import com.inklink.backend.service.ReviewService;
import com.inklink.backend.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;
    private final UserService userService;

    public ReviewController(ReviewService reviewService, UserService userService){
        this.service = reviewService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public Review addReview(@RequestParam Long purchaseId, @RequestParam Integer rating, @RequestParam String comment) {
        String mail = SecurityContextHolder.getContext().getAuthentication().getName();
        User requester = userService.getUserByMail(mail);
        return service.addReview(purchaseId, rating, comment, requester);
    }
}