package com.afzal.tickets.controller;

import com.afzal.tickets.dto.event.GetPublishedEventDetailsResponseDto;
import com.afzal.tickets.dto.event.ListPublishedEventResponseDto;
import com.afzal.tickets.mapper.EventMapper;
import com.afzal.tickets.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/published-events")
@RequiredArgsConstructor
public class PublishedEventController {

    private final EventService eventService;
    private final EventMapper eventMapper;

    @GetMapping
    public ResponseEntity<PagedModel<ListPublishedEventResponseDto>> listPublishedEvents(Pageable pageable) {
        Page<ListPublishedEventResponseDto> page = eventService.listPublishedEvents(pageable)
                .map(eventMapper::toListPublishedEventResponseDto);
        return ResponseEntity.ok(new PagedModel<>(page));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedModel<ListPublishedEventResponseDto>> searchPublishedEvents(
            @RequestParam("q") String query,
            Pageable pageable) {

        Page<ListPublishedEventResponseDto> page = eventService.searchPublishedEvents(query, pageable)
                .map(eventMapper::toListPublishedEventResponseDto);
        return ResponseEntity.ok(new PagedModel<>(page));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<GetPublishedEventDetailsResponseDto> getPublishedEvent(@PathVariable UUID eventId) {
        return eventService.getPublishedEvent(eventId)
                .map(event -> ResponseEntity.ok(eventMapper.toGetPublishedEventDetailsResponseDto(event)))
                .orElse(ResponseEntity.notFound().build());
    }
}