package com.inklink.backend.service;
import com.inklink.backend.model.Artwork;
import com.inklink.backend.model.Purchase;
import com.inklink.backend.model.PurchaseStatus;
import com.inklink.backend.repository.PurchaseRepository;
import com.inklink.backend.repository.ArtworkRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ArtworkService
{
    private final ArtworkRepository repository;
    private final PurchaseRepository purchaseRepository;

    public ArtworkService(ArtworkRepository repository, PurchaseRepository purchaseRepository)
    {
        this.repository = repository;
        this.purchaseRepository = purchaseRepository;
    }

    @Transactional
    public Artwork uploadArtwork(Long purchaseId, String fileUrl)
    {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Acquisto non trovato"));
        if (purchase.getStatus() != PurchaseStatus.PAID)
            throw new RuntimeException("Impossibile caricare l'artwork: l'acquisto non è in stato PAID");
        Artwork artwork = new Artwork();
        artwork.setFileUrl(fileUrl);
        artwork.setPurchase(purchase);
        repository.save(artwork);
        purchase.setStatus(PurchaseStatus.DELIVERED);
        purchaseRepository.save(purchase);
        return artwork;
    }
}