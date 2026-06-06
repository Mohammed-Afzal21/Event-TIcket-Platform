package com.afzal.tickets.exception;
public class TicketsSoldOutException extends RuntimeException {
    public TicketsSoldOutException() { super("Tickets sold out"); }
}
