package com.afzal.tickets.dto.event;
import com.afzal.tickets.domain.enums.EventStatusEnum;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@Data @AllArgsConstructor @NoArgsConstructor
public class UpdateEventRequestDto {
    private UUID id;
    private String name;
    private LocalDateTime start;
    private LocalDateTime end;
    private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    private EventStatusEnum status;
    private List<UpdateTicketTypeRequestDto> ticketTypes;
}
