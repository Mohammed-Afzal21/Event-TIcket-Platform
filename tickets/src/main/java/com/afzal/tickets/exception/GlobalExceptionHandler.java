package com.afzal.tickets.exception;

import com.afzal.tickets.dto.ErrorDto;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<ErrorDto> handleEventNotFound(EventNotFoundException ex) {
        log.error("EventNotFoundException: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorDto("Event not found"));
    }

    @ExceptionHandler(EventUpdateException.class)
    public ResponseEntity<ErrorDto> handleEventUpdate(EventUpdateException ex) {
        log.error("EventUpdateException: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorDto("Unable to update event"));
    }

    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<ErrorDto> handleTicketNotFound(TicketNotFoundException ex) {
        log.error("TicketNotFoundException: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorDto("Ticket not found"));
    }

    @ExceptionHandler(TicketTypeNotFoundException.class)
    public ResponseEntity<ErrorDto> handleTicketTypeNotFound(TicketTypeNotFoundException ex) {
        log.error("TicketTypeNotFoundException: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorDto("Ticket type not found"));
    }

    @ExceptionHandler(TicketsSoldOutException.class)
    public ResponseEntity<ErrorDto> handleTicketsSoldOut(TicketsSoldOutException ex) {
        log.error("TicketsSoldOutException: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorDto("Tickets are sold out for this ticket type"));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorDto> handleUserNotFound(UserNotFoundException ex) {
        log.error("UserNotFoundException: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(new ErrorDto("User not found"));
    }

    @ExceptionHandler(QrCodeNotFoundException.class)
    public ResponseEntity<ErrorDto> handleQrCodeNotFound(QrCodeNotFoundException ex) {
        log.error("QrCodeNotFoundException: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto("QR code not found"));
    }

    @ExceptionHandler(QrCodeGenerationException.class)
    public ResponseEntity<ErrorDto> handleQrCodeGeneration(QrCodeGenerationException ex) {
        log.error("QrCodeGenerationException: {}", ex.getMessage(), ex.getCause());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto("Unable to generate QR Code"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDto> handleValidation(MethodArgumentNotValidException ex) {
        log.error("MethodArgumentNotValidException: {}", ex.getMessage());
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getDefaultMessage())
                .orElse("Validation error");
        return ResponseEntity.badRequest().body(new ErrorDto(message));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorDto> handleConstraintViolation(ConstraintViolationException ex) {
        log.error("ConstraintViolationException: {}", ex.getMessage());
        String message = ex.getConstraintViolations().stream()
                .findFirst()
                .map(cv -> cv.getMessage())
                .orElse("Constraint violation");
        return ResponseEntity.badRequest().body(new ErrorDto(message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> handleGeneral(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto("An unknown error occurred"));
    }
}
