package com.afzal.tickets.service;

import com.afzal.tickets.domain.entity.QrCode;
import com.afzal.tickets.domain.entity.Ticket;

import java.util.UUID;

public interface QrCodeService {
    QrCode generateQrCode(Ticket ticket);
    byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId);
}
