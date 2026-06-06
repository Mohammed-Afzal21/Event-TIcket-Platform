package com.afzal.tickets.dto.ticket;
import com.afzal.tickets.domain.enums.TicketStatusEnum;
import lombok.*;
import java.util.UUID;
@Data @AllArgsConstructor @NoArgsConstructor
public class ListTicketResponseDto {
    private UUID id;
    private TicketStatusEnum status;
    private ListTicketTicketTypeResponseDto ticketType;
}
