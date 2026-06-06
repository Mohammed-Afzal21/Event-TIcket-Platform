package com.afzal.tickets.exception;
public class TicketNotFoundException extends RuntimeException {
    public TicketNotFoundException() { super("Ticket not found"); }
}
