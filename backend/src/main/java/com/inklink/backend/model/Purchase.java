package com.inklink.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "purchases")
public class Purchase
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne //Questo viene fatto quando colleghiamo un'entità, column solo per campi semplici
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(nullable = false, updatable = false)
    private LocalDateTime purchaseDate = LocalDateTime.now();

    @Column(nullable = false)
    private Double paidPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseStatus status = PurchaseStatus.PAID;

    //serve per avere la chat dell'acquisto
    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();

    //permette di accedere all'artwork da purchase
    @OneToOne(mappedBy = "purchase", cascade = CascadeType.ALL)
    private Artwork artwork;

    //permette di avere il rating per l'artwork
    @OneToOne(mappedBy = "purchase", cascade = CascadeType.ALL)
    private Review review;

    // getter "piatti" per esporre gli id di slot e acquirente nel JSON,
    // dato che i campi "slot" e "buyer" sono @JsonIgnore per evitare la ricorsione
    public Long getSlotId() {
        return slot != null ? slot.getId() : null;
    }

    public Long getBuyerId() {
        return buyer != null ? buyer.getId() : null;
    }
}