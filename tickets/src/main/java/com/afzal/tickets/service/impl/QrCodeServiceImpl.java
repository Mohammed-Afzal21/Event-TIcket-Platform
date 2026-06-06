package com.afzal.tickets.service.impl;

import com.afzal.tickets.domain.entity.QrCode;
import com.afzal.tickets.domain.entity.Ticket;
import com.afzal.tickets.domain.enums.QrCodeStatusEnum;
import com.afzal.tickets.exception.QrCodeGenerationException;
import com.afzal.tickets.exception.QrCodeNotFoundException;
import com.afzal.tickets.repository.QrCodeRepository;
import com.afzal.tickets.service.QrCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class QrCodeServiceImpl implements QrCodeService {

    private final QrCodeRepository qrCodeRepository;
    private final QRCodeWriter qrCodeWriter;

    @Override
    public QrCode generateQrCode(Ticket ticket) {
        UUID uniqueId = UUID.randomUUID();

        try {
            BitMatrix bitMatrix = qrCodeWriter.encode(
                    uniqueId.toString(),
                    BarcodeFormat.QR_CODE,
                    300, 300
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] pngBytes = outputStream.toByteArray();
            String base64Value = Base64.getEncoder().encodeToString(pngBytes);

            QrCode qrCode = QrCode.builder()
                    .id(uniqueId)
                    .status(QrCodeStatusEnum.ACTIVE)
                    .value(base64Value)
                    .ticket(ticket)
                    .build();

            return qrCodeRepository.saveAndFlush(qrCode);

        } catch (WriterException | IOException e) {
            throw new QrCodeGenerationException("Failed to generate QR code for ticket: " + ticket.getId(), e);
        }
    }

    @Override
    public byte[] getQrCodeImageForUserAndTicket(UUID userId, UUID ticketId) {
        QrCode qrCode = qrCodeRepository.findByTicketIdAndTicketPurchaserId(ticketId, userId)
                .orElseThrow(QrCodeNotFoundException::new);

        try {
            return Base64.getDecoder().decode(qrCode.getValue());
        } catch (IllegalArgumentException e) {
            log.error("Failed to decode base64 QR code for ticketId={}, userId={}", ticketId, userId, e);
            throw new QrCodeNotFoundException();
        }
    }
}
