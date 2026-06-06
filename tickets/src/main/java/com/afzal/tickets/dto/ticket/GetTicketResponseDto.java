package com.afzal.tickets.dto.ticket;
import com.afzal.tickets.domain.enums.TicketStatusEnum;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Data @AllArgsConstructor @NoArgsConstructor
public class GetTicketResponseDto {
    private UUID id;
    private TicketStatusEnum status;
    private Double price;
    private String description;
    private String eventName;
    private String eventVenue;
    private LocalDateTime eventStart;
    private LocalDateTime eventEnd;
}
