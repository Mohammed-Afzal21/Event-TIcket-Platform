package com.afzal.tickets.controller;

import com.afzal.tickets.domain.entity.TicketValidation;
import com.afzal.tickets.domain.enums.TicketValidationMethod;
import com.afzal.tickets.dto.validation.TicketValidationRequestDto;
import com.afzal.tickets.dto.validation.TicketValidationResponseDto;
import com.afzal.tickets.mapper.TicketValidationMapper;
import com.afzal.tickets.service.TicketValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ticket-validations")
@RequiredArgsConstructor
public class TicketValidationController {

    private final TicketValidationService ticketValidationService;
    private final TicketValidationMapper ticketValidationMapper;

    @PostMapping
    public ResponseEntity<TicketValidationResponseDto> validateTicket(
            @RequestBody TicketValidationRequestDto requestDto) {

        TicketValidation validation;

        if (requestDto.getMethod() == TicketValidationMethod.QR_SCAN) {
            validation = ticketValidationService.validateTicketByQrCode(requestDto.getId());
        } else {
            validation = ticketValidationService.validateTicketManually(requestDto.getId());
        }

        return ResponseEntity.ok(ticketValidationMapper.toTicketValidationResponseDto(validation));
    }
}
