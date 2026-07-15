package com.inklink.backend.repository;
import com.inklink.backend.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import com.inklink.backend.model.SlotStatus;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long>
{
    List<Slot> findByArtistId(Long artistId);
    List<Slot> findByArtistIdAndStatus(Long artistId, SlotStatus status);
}
