package com.inklink.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Data //genera getter e setter e toString automaticamente
@Entity
@Table(name = "users")
public class User
{
    @Id //questo elemento specifica che ID è la chiave
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false)
    private String mail;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    private String phone;

    @Column(nullable = true)
    private String bio;

    @Column(nullable = false, updatable = false) //updatable impedisce che, una volta impostata la data per la prima volta, essa non potrà essere più modificata
    private LocalDateTime registrationDate = LocalDateTime.now(); //now() salava la data al momento della registrazione

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL)
    private List<Slot> slots = new ArrayList<>();

    //rappresenta i vari acquisti che un utente può aver fatto, dato che ne può fare diversi contemporaneamente
    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL)
    private List<Purchase> purchases = new ArrayList<>();
}