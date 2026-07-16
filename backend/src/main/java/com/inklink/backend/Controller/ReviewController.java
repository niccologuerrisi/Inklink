package com.inklink.backend.controller;

import com.inklink.backend.model.Review;
import com.inklink.backend.service.ReviewService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService service;

    public ReviewController(ReviewService reviewService){
        this.service = reviewService;
    }

    @PostMapping("/add")
    public Review addReview(@RequestParam Long purchaseId, @RequestParam Integer rating, @RequestParam String comment) {
        return service.addReview(purchaseId,rating,comment);
    }
}