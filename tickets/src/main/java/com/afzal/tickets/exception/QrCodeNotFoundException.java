package com.afzal.tickets.exception;
public class QrCodeNotFoundException extends RuntimeException {
    public QrCodeNotFoundException() { super("QR code not found"); }
}
