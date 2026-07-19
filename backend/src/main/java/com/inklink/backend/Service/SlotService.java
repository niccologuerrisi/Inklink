package com.inklink.backend.service;
import com.inklink.backend.model.Slot;
import com.inklink.backend.model.SlotStatus;
import com.inklink.backend.model.User;
import com.inklink.backend.repository.SlotRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SlotService
{
    private final SlotRepository repository;
    public SlotService(SlotRepository repository) {this.repository = repository;}

    public void createDefaultSlots(User artist)
    {
        for (int i = 1; i <= 3; i++)
        {
            Slot slot = new Slot();
            slot.setTitle("Slot " + i);
            slot.setArtist(artist);
            slot.setPrice(0.0);
            repository.save(slot);
        }
    }

    public Slot getSlotById(Long id)
    {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot non trovato"));
    }

    public List<Slot> getSlotsByArtist(Long artistId) {return repository.findByArtistId(artistId);}

    public List<Slot> getSlotsByArtistAndStatus(Long artistId, SlotStatus status) {return repository.findByArtistIdAndStatus(artistId, status);}

    public void updatePrice(Long slotId, Double newPrice, User requester)
    {
        Slot slot = repository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot non trovato"));

        if (!slot.getArtist().getId().equals(requester.getId())) {
            throw new RuntimeException("Non puoi modificare uno slot che non è tuo");
        }

        slot.setPrice(newPrice);
        repository.save(slot); //serve a sincronizzare il cambiamento nel database(se
        // non si è dentro una transazione)
    }
}