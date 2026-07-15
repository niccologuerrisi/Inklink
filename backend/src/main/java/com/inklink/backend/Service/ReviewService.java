package com.inklink.backend.service;
import com.inklink.backend.repository.ReviewRepository;
import com.inklink.backend.repository.PurchaseRepository;
import org.springframework.stereotype.Service;
import com.inklink.backend.model.Purchase;
import com.inklink.backend.model.PurchaseStatus;
import com.inklink.backend.model.Review;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService
{
    private final ReviewRepository repository;
    private final PurchaseRepository purchaseRepository;

    public ReviewService(ReviewRepository repository, PurchaseRepository purchaseRepository)
    {
        this.repository = repository;
        this.purchaseRepository = purchaseRepository;
    }

    @Transactional
    public Review addReview(Long purchaseId, Integer rating, String comment) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Acquisto non trovato"));
        if (purchase.getStatus() != PurchaseStatus.COMPLETED)
            throw new RuntimeException("Impossibile caricare la review: l'acquisto non è completato");
        Review review = new Review();
        review.setRating(rating);
        review.setComment(comment);
        review.setPurchase(purchase);
        repository.save(review);
        return review;
    }
}