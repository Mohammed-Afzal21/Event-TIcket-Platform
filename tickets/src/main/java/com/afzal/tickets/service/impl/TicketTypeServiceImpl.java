package com.afzal.tickets.service.impl;

import com.afzal.tickets.domain.entity.Ticket;
import com.afzal.tickets.domain.entity.TicketType;
import com.afzal.tickets.domain.entity.User;
import com.afzal.tickets.domain.enums.TicketStatusEnum;
import com.afzal.tickets.exception.TicketTypeNotFoundException;
import com.afzal.tickets.exception.TicketsSoldOutException;
import com.afzal.tickets.exception.UserNotFoundException;
import com.afzal.tickets.repository.TicketRepository;
import com.afzal.tickets.repository.TicketTypeRepository;
import com.afzal.tickets.repository.UserRepository;
import com.afzal.tickets.service.QrCodeService;
import com.afzal.tickets.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {

    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketRepository ticketRepository;
    private final QrCodeService qrCodeService;

    @Override
    @Transactional
    public Ticket purchaseTicket(UUID userId, UUID ticketTypeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));

        TicketType ticketType = ticketTypeRepository.findByIdWithLock(ticketTypeId)
                .orElseThrow(() -> new TicketTypeNotFoundException("Ticket type not found: " + ticketTypeId));

        int soldCount = ticketRepository.countByTicketTypeId(ticketTypeId);

        if (ticketType.getTotalAvailable() != null && soldCount + 1 > ticketType.getTotalAvailable()) {
            throw new TicketsSoldOutException();
        }

        Ticket ticket = Ticket.builder()
                .status(TicketStatusEnum.PURCHASED)
                .ticketType(ticketType)
                .purchaser(user)
                .build();

        // Save exactly once
        Ticket savedTicket = ticketRepository.save(ticket);

        // Generate QR code (uses qrCodeRepository.saveAndFlush internally — do NOT save ticket again)
        qrCodeService.generateQrCode(savedTicket);

        return savedTicket;
    }
}
