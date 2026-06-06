package com.afzal.tickets.service.impl;

import com.afzal.tickets.domain.entity.Event;
import com.afzal.tickets.domain.entity.TicketType;
import com.afzal.tickets.domain.entity.User;
import com.afzal.tickets.domain.enums.EventStatusEnum;
import com.afzal.tickets.domain.request.CreateEventRequest;
import com.afzal.tickets.domain.request.UpdateEventRequest;
import com.afzal.tickets.domain.request.UpdateTicketTypeRequest;
import com.afzal.tickets.exception.EventNotFoundException;
import com.afzal.tickets.exception.EventUpdateException;
import com.afzal.tickets.repository.EventRepository;
import com.afzal.tickets.repository.UserRepository;
import com.afzal.tickets.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Event createEvent(UUID organizerId, CreateEventRequest request) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new EventNotFoundException("Organizer not found: " + organizerId));

        Event event = Event.builder()
                .name(request.getName())
                .start(request.getStart())
                .end(request.getEnd())
                .venue(request.getVenue())
                .salesStart(request.getSalesStart())
                .salesEnd(request.getSalesEnd())
                .status(request.getStatus())
                .organizer(organizer)
                .build();

        List<TicketType> ticketTypes = request.getTicketTypes().stream()
                .map(ttReq -> TicketType.builder()
                        .name(ttReq.getName())
                        .price(ttReq.getPrice())
                        .description(ttReq.getDescription())
                        .totalAvailable(ttReq.getTotalAvailable())
                        .event(event)
                        .build())
                .collect(Collectors.toList());

        event.setTicketTypes(ticketTypes);
        return eventRepository.save(event);
    }

    @Override
    public Page<Event> listEventsForOrganizer(UUID organizerId, Pageable pageable) {
        return eventRepository.findByOrganizerId(organizerId, pageable);
    }

    @Override
    public Optional<Event> getEventForOrganizer(UUID organizerId, UUID id) {
        return eventRepository.findByIdAndOrganizerId(id, organizerId);
    }

    @Override
    @Transactional
    public Event updateEventForOrganizer(UUID organizerId, UUID id, UpdateEventRequest request) {
        if (request.getId() == null || !request.getId().equals(id)) {
            throw new EventUpdateException("Event ID in body does not match path ID");
        }

        Event existing = eventRepository.findByIdAndOrganizerId(id, organizerId)
                .orElseThrow(() -> new EventNotFoundException("Event not found: " + id));

        existing.setName(request.getName());
        existing.setStart(request.getStart());
        existing.setEnd(request.getEnd());
        existing.setVenue(request.getVenue());
        existing.setSalesStart(request.getSalesStart());
        existing.setSalesEnd(request.getSalesEnd());
        existing.setStatus(request.getStatus());

        if (request.getTicketTypes() != null) {
            List<UUID> requestIds = request.getTicketTypes().stream()
                    .map(UpdateTicketTypeRequest::getId)
                    .filter(ttId -> ttId != null)
                    .collect(Collectors.toList());

            existing.getTicketTypes().removeIf(tt -> !requestIds.contains(tt.getId()));

            for (UpdateTicketTypeRequest ttReq : request.getTicketTypes()) {
                if (ttReq.getId() == null) {
                    TicketType newTt = TicketType.builder()
                            .name(ttReq.getName())
                            .price(ttReq.getPrice())
                            .description(ttReq.getDescription())
                            .totalAvailable(ttReq.getTotalAvailable())
                            .event(existing)
                            .build();
                    existing.getTicketTypes().add(newTt);
                } else {
                    existing.getTicketTypes().stream()
                            .filter(tt -> tt.getId().equals(ttReq.getId()))
                            .findFirst()
                            .ifPresent(tt -> {
                                tt.setName(ttReq.getName());
                                tt.setPrice(ttReq.getPrice());
                                tt.setDescription(ttReq.getDescription());
                                tt.setTotalAvailable(ttReq.getTotalAvailable());
                            });
                }
            }
        }

        return eventRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteEventForOrganizer(UUID organizerId, UUID id) {
        Event event = eventRepository.findByIdAndOrganizerId(id, organizerId)
                .orElseThrow(() -> new EventNotFoundException("Event not found: " + id));
        eventRepository.delete(event);
    }

    @Override
    public Page<Event> listPublishedEvents(Pageable pageable) {
        return eventRepository.findByStatus(EventStatusEnum.PUBLISHED, pageable);
    }

    @Override
    public Page<Event> searchPublishedEvents(String query, Pageable pageable) {
        return eventRepository.searchEvents(query, pageable);
    }

    @Override
    public Optional<Event> getPublishedEvent(UUID id) {
        return eventRepository.findByIdAndStatus(id, EventStatusEnum.PUBLISHED);
    }
}