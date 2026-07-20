package com.inklink.backend.repository;
import com.inklink.backend.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findBySlot_Artist_Id(Long artistId);
}