package com.afzal.tickets.mapper;

import com.afzal.tickets.domain.entity.Ticket;
import com.afzal.tickets.dto.ticket.GetTicketResponseDto;
import com.afzal.tickets.dto.ticket.ListTicketResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TicketMapper {

    ListTicketResponseDto toListTicketResponseDto(Ticket ticket);

    @Mapping(target = "price",       source = "ticket.ticketType.price")
    @Mapping(target = "description", source = "ticket.ticketType.description")
    @Mapping(target = "eventName",   source = "ticket.ticketType.event.name")
    @Mapping(target = "eventVenue",  source = "ticket.ticketType.event.venue")
    @Mapping(target = "eventStart",  source = "ticket.ticketType.event.start")
    @Mapping(target = "eventEnd",    source = "ticket.ticketType.event.end")
    GetTicketResponseDto toGetTicketResponseDto(Ticket ticket);
}