package com.afzal.tickets.controller;

import com.afzal.tickets.dto.ticket.GetTicketResponseDto;
import com.afzal.tickets.dto.ticket.ListTicketResponseDto;
import com.afzal.tickets.mapper.TicketMapper;
import com.afzal.tickets.security.JwtUtil;
import com.afzal.tickets.service.QrCodeService;
import com.afzal.tickets.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final QrCodeService qrCodeService;
    private final TicketMapper ticketMapper;

    @GetMapping
    public ResponseEntity<PagedModel<ListTicketResponseDto>> listTickets(
            @AuthenticationPrincipal Jwt jwt,
            Pageable pageable) {

        UUID userId = JwtUtil.parseUserId(jwt);
        Page<ListTicketResponseDto> page = ticketService.listTicketsForUser(userId, pageable)
                .map(ticketMapper::toListTicketResponseDto);
        return ResponseEntity.ok(new PagedModel<>(page));
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<GetTicketResponseDto> getTicket(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID ticketId) {

        UUID userId = JwtUtil.parseUserId(jwt);
        return ticketService.getTicketForUser(userId, ticketId)
                .map(ticket -> ResponseEntity.ok(ticketMapper.toGetTicketResponseDto(ticket)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{ticketId}/qr-code")
    public ResponseEntity<byte[]> getQrCode(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID ticketId) {

        UUID userId = JwtUtil.parseUserId(jwt);
        byte[] imageBytes = qrCodeService.getQrCodeImageForUserAndTicket(userId, ticketId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(imageBytes);
    }
}
