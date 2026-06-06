package com.afzal.tickets.controller;

import com.afzal.tickets.domain.entity.Event;
import com.afzal.tickets.domain.request.CreateEventRequest;
import com.afzal.tickets.domain.request.UpdateEventRequest;
import com.afzal.tickets.dto.event.*;
import com.afzal.tickets.mapper.EventMapper;
import com.afzal.tickets.security.JwtUtil;
import com.afzal.tickets.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @PostMapping
    public ResponseEntity<CreateEventResponseDto> createEvent(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateEventRequestDto requestDto) {

        UUID organizerId = JwtUtil.parseUserId(jwt);
        CreateEventRequest request = eventMapper.toCreateEventRequest(requestDto);
        Event event = eventService.createEvent(organizerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(eventMapper.toCreateEventResponseDto(event));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<UpdateEventResponseDto> updateEvent(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID eventId,
            @Valid @RequestBody UpdateEventRequestDto requestDto) {

        UUID organizerId = JwtUtil.parseUserId(jwt);
        UpdateEventRequest request = eventMapper.toUpdateEventRequest(requestDto);
        Event event = eventService.updateEventForOrganizer(organizerId, eventId, request);
        return ResponseEntity.ok(eventMapper.toUpdateEventResponseDto(event));
    }

    @GetMapping
    public ResponseEntity<PagedModel<ListEventResponseDto>> listEvents(
            @AuthenticationPrincipal Jwt jwt,
            Pageable pageable) {

        UUID organizerId = JwtUtil.parseUserId(jwt);
        Page<ListEventResponseDto> page = eventService.listEventsForOrganizer(organizerId, pageable)
                .map(eventMapper::toListEventResponseDto);
        return ResponseEntity.ok(new PagedModel<>(page));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<GetEventDetailsResponseDto> getEvent(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID eventId) {

        UUID organizerId = JwtUtil.parseUserId(jwt);
        return eventService.getEventForOrganizer(organizerId, eventId)
                .map(event -> ResponseEntity.ok(eventMapper.toGetEventDetailsResponseDto(event)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID eventId) {

        UUID organizerId = JwtUtil.parseUserId(jwt);
        eventService.deleteEventForOrganizer(organizerId, eventId);
        return ResponseEntity.noContent().build();
    }
}