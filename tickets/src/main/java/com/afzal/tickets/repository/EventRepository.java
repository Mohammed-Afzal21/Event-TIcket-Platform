package com.afzal.tickets.repository;

import com.afzal.tickets.domain.entity.Event;
import com.afzal.tickets.domain.enums.EventStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

    Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);

    @EntityGraph(attributePaths = "ticketTypes")
    Optional<Event> findByIdAndOrganizerId(UUID id, UUID organizerId);

    Page<Event> findByStatus(EventStatusEnum status, Pageable pageable);

    @EntityGraph(attributePaths = "ticketTypes")
    Optional<Event> findByIdAndStatus(UUID id, EventStatusEnum status);

    @Query(
            value = "SELECT * FROM events e WHERE e.status = 'PUBLISHED' " +
                    "AND to_tsvector('english', COALESCE(e.name,'') || ' ' || COALESCE(e.venue,'')) " +
                    "@@ plainto_tsquery('english', :searchTerm)",
            countQuery = "SELECT COUNT(*) FROM events e WHERE e.status = 'PUBLISHED' " +
                    "AND to_tsvector('english', COALESCE(e.name,'') || ' ' || COALESCE(e.venue,'')) " +
                    "@@ plainto_tsquery('english', :searchTerm)",
            nativeQuery = true
    )
    Page<Event> searchEvents(@Param("searchTerm") String searchTerm, Pageable pageable);
}