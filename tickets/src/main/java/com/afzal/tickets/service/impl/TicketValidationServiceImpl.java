package com.afzal.tickets.service.impl;

import com.afzal.tickets.domain.entity.Ticket;
import com.afzal.tickets.domain.entity.TicketValidation;
import com.afzal.tickets.domain.enums.QrCodeStatusEnum;
import com.afzal.tickets.domain.enums.TicketValidationMethod;
import com.afzal.tickets.domain.enums.TicketValidationStatusEnum;
import com.afzal.tickets.exception.QrCodeNotFoundException;
import com.afzal.tickets.exception.TicketNotFoundException;
import com.afzal.tickets.repository.QrCodeRepository;
import com.afzal.tickets.repository.TicketRepository;
import com.afzal.tickets.repository.TicketValidationRepository;
import com.afzal.tickets.service.TicketValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketValidationServiceImpl implements TicketValidationService {

    private final QrCodeRepository qrCodeRepository;
    private final TicketRepository ticketRepository;
    private final TicketValidationRepository ticketValidationRepository;

    @Override
    @Transactional
    public TicketValidation validateTicketByQrCode(UUID qrCodeId) {
        var qrCode = qrCodeRepository.findByIdAndStatus(qrCodeId, QrCodeStatusEnum.ACTIVE)
                .orElseThrow(QrCodeNotFoundException::new);
        return validateTicket(qrCode.getTicket(), TicketValidationMethod.QR_SCAN);
    }

    @Override
    @Transactional
    public TicketValidation validateTicketManually(UUID ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(TicketNotFoundException::new);
        return validateTicket(ticket, TicketValidationMethod.MANUAL);
    }

    private TicketValidation validateTicket(Ticket ticket, TicketValidationMethod method) {
        boolean alreadyValid = ticket.getValidations().stream()
                .anyMatch(v -> v.getStatus() == TicketValidationStatusEnum.VALID);

        TicketValidationStatusEnum status = alreadyValid
                ? TicketValidationStatusEnum.INVALID
                : TicketValidationStatusEnum.VALID;

        TicketValidation validation = TicketValidation.builder()
                .ticket(ticket)
                .status(status)
                .validationMethod(method)
                .build();

        return ticketValidationRepository.save(validation);
    }
}
