package com.afzal.tickets.service;

import com.afzal.tickets.domain.entity.TicketValidation;
import java.util.UUID;

public interface TicketValidationService {
    TicketValidation validateTicketByQrCode(UUID qrCodeId);
    TicketValidation validateTicketManually(UUID ticketId);
}
