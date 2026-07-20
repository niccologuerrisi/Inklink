package com.inklink.backend.service;
import com.inklink.backend.repository.PurchaseRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.inklink.backend.repository.SlotRepository;
import com.inklink.backend.model.Purchase;
import com.inklink.backend.model.Slot;
import com.inklink.backend.model.SlotStatus;
import com.inklink.backend.model.User;
import com.inklink.backend.model.PurchaseStatus;
import java.util.List;

@Service
public class PurchaseService
{
    private final PurchaseRepository repository;
    private final SlotRepository slotRepository;

    public PurchaseService(PurchaseRepository repository, SlotRepository slotRepository)
    {
        this.repository = repository;
        this.slotRepository = slotRepository;
    }

    //transactional serve praticamente per fare rollback, così che se qualcosa vada male
    //ad esempio, se la purchase andasse male, lo slot tornerebbe open, come se l'acquisto
    //non fosse mai avvenuto, invece di renderlo occupato e quindi rendendolo inutilizzabile
    @Transactional
    public Purchase buySlot(Long slotId, User buyer)
    {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot non trovato"));

        if (slot.getStatus() != SlotStatus.OPEN)
            throw new RuntimeException("Slot non disponibile");
        Purchase purchase = new Purchase();
        purchase.setSlot(slot);
        purchase.setBuyer(buyer);
        purchase.setPaidPrice(slot.getPrice());
        // lo stato è già PAID di default, come definito nell'entità

        slot.setStatus(SlotStatus.OCCUPIED);
        slotRepository.save(slot);

        return repository.save(purchase);
    }

    @Transactional
    public Purchase completePurchase(Long purchaseId)
    {
        Purchase purchase = repository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Acquisto non trovato"));
        if (purchase.getStatus() != PurchaseStatus.DELIVERED)
            throw new RuntimeException("Acquisto non consegnato");
        purchase.setStatus(PurchaseStatus.COMPLETED);
        Slot slot = purchase.getSlot();
        slot.setStatus(SlotStatus.OPEN);
        slotRepository.save(slot);
        return repository.save(purchase);
    }

    public Purchase getPurchaseById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acquisto non trovato"));
    }

    public List<Purchase> getPurchasesForArtist(Long artistId) {
        return repository.findBySlot_ArtistId(artistId);
    }
}