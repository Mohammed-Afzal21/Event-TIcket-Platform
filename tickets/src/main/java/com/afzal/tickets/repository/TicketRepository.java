package com.afzal.tickets.repository;

import com.afzal.tickets.domain.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    // Override inherited findById to eagerly fetch associations for mapping
    @Override
    @EntityGraph(attributePaths = {"ticketType", "ticketType.event"})
    Optional<Ticket> findById(UUID id);

    @EntityGraph(attributePaths = {"ticketType", "ticketType.event"})
    Page<Ticket> findByPurchaserId(UUID purchaserId, Pageable pageable);

    @EntityGraph(attributePaths = {"ticketType", "ticketType.event"})
    Optional<Ticket> findByIdAndPurchaserId(UUID id, UUID purchaserId);

    int countByTicketTypeId(UUID ticketTypeId);
}