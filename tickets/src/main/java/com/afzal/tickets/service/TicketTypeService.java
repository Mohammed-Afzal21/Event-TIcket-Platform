package com.afzal.tickets.service;

import com.afzal.tickets.domain.entity.Ticket;
import java.util.UUID;

public interface TicketTypeService {
    Ticket purchaseTicket(UUID userId, UUID ticketTypeId);
}
