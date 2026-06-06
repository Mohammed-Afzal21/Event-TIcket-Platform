package com.afzal.tickets.mapper;

import com.afzal.tickets.domain.entity.Event;
import com.afzal.tickets.domain.entity.TicketType;
import com.afzal.tickets.domain.request.CreateEventRequest;
import com.afzal.tickets.domain.request.CreateTicketTypeRequest;
import com.afzal.tickets.domain.request.UpdateEventRequest;
import com.afzal.tickets.domain.request.UpdateTicketTypeRequest;
import com.afzal.tickets.dto.event.CreateEventRequestDto;
import com.afzal.tickets.dto.event.CreateEventResponseDto;
import com.afzal.tickets.dto.event.CreateTicketTypeRequestDto;
import com.afzal.tickets.dto.event.CreateTicketTypeResponseDto;
import com.afzal.tickets.dto.event.GetEventDetailsResponseDto;
import com.afzal.tickets.dto.event.GetEventDetailsTicketTypesResponseDto;
import com.afzal.tickets.dto.event.GetPublishedEventDetailsResponseDto;
import com.afzal.tickets.dto.event.ListEventResponseDto;
import com.afzal.tickets.dto.event.ListEventTicketTypeResponseDto;
import com.afzal.tickets.dto.event.ListPublishedEventResponseDto;
import com.afzal.tickets.dto.event.UpdateEventRequestDto;
import com.afzal.tickets.dto.event.UpdateEventResponseDto;
import com.afzal.tickets.dto.event.UpdateTicketTypeRequestDto;
import com.afzal.tickets.dto.event.UpdateTicketTypeResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {

    CreateEventRequest toCreateEventRequest(CreateEventRequestDto dto);

    CreateTicketTypeRequest toCreateTicketTypeRequest(CreateTicketTypeRequestDto dto);

    UpdateEventRequest toUpdateEventRequest(UpdateEventRequestDto dto);

    UpdateTicketTypeRequest toUpdateTicketTypeRequest(UpdateTicketTypeRequestDto dto);

    CreateEventResponseDto toCreateEventResponseDto(Event event);

    CreateTicketTypeResponseDto toCreateTicketTypeResponseDto(TicketType ticketType);

    UpdateEventResponseDto toUpdateEventResponseDto(Event event);

    UpdateTicketTypeResponseDto toUpdateTicketTypeResponseDto(TicketType ticketType);

    @Mapping(target = "ticketTypes", ignore = true)
    ListEventResponseDto toListEventResponseDto(Event event);

    ListEventTicketTypeResponseDto toListEventTicketTypeResponseDto(TicketType ticketType);

    GetEventDetailsResponseDto toGetEventDetailsResponseDto(Event event);

    GetEventDetailsTicketTypesResponseDto toGetEventDetailsTicketTypesResponseDto(TicketType ticketType);

    @Mapping(target = "ticketTypes", ignore = true)
    ListPublishedEventResponseDto toListPublishedEventResponseDto(Event event);

    GetPublishedEventDetailsResponseDto toGetPublishedEventDetailsResponseDto(Event event);
}