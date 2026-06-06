package com.afzal.tickets.dto.ticket;
import lombok.*;
import java.util.UUID;
@Data @AllArgsConstructor @NoArgsConstructor
public class ListTicketTicketTypeResponseDto {
    private UUID id;
    private String name;
}
