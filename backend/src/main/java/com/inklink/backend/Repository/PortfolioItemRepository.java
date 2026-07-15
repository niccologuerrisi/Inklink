package com.inklink.backend.repository;
import com.inklink.backend.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long>
{
    List<PortfolioItem> findByOwnerId(Long ownerId);
}
