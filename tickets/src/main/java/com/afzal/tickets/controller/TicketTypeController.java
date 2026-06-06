package com.afzal.tickets.controller;

import com.afzal.tickets.domain.entity.Ticket;
import com.afzal.tickets.dto.ticket.GetTicketResponseDto;
import com.afzal.tickets.mapper.TicketMapper;
import com.afzal.tickets.security.JwtUtil;
import com.afzal.tickets.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ticket-types")
@RequiredArgsConstructor
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;
    private final TicketMapper ticketMapper;

    @PostMapping("/{ticketTypeId}/purchase")
    public ResponseEntity<GetTicketResponseDto> purchaseTicket(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID ticketTypeId) {

        UUID userId = JwtUtil.parseUserId(jwt);
        Ticket ticket = ticketTypeService.purchaseTicket(userId, ticketTypeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketMapper.toGetTicketResponseDto(ticket));
    }
}
