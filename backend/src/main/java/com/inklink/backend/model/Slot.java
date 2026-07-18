package com.inklink.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;


@Data
@Entity
@Table(name = "slots")
public class Slot
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status = SlotStatus.OPEN;

    // senza JsonIgnore gli slot andranno a chiamare ricorsivamente l'artista, che è lo user,
    // che avrà liste di slot che avranno artisti user, e così via
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = false)
    private User artist;

    // getter "piatto" che espone solo l'id dell'artista nel JSON, senza serializzare
    // l'intero oggetto User (che è @JsonIgnore per evitare la ricorsione infinita)
    public Long getArtistId() {
        return artist != null ? artist.getId() : null;
    }
}