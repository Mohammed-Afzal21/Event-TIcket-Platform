package com.afzal.tickets.repository;

import com.afzal.tickets.domain.entity.QrCode;
import com.afzal.tickets.domain.enums.QrCodeStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QrCodeRepository extends JpaRepository<QrCode, UUID> {
    Optional<QrCode> findByIdAndStatus(UUID id, QrCodeStatusEnum status);
    Optional<QrCode> findByTicketIdAndTicketPurchaserId(UUID ticketId, UUID purchaserId);
}
