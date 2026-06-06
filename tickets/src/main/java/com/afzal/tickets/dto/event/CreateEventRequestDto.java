package com.afzal.tickets.dto.event;
import com.afzal.tickets.domain.enums.EventStatusEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Data @AllArgsConstructor @NoArgsConstructor
public class CreateEventRequestDto {
    @NotBlank private String name;
    private LocalDateTime start;
    private LocalDateTime end;
    @NotBlank private String venue;
    private LocalDateTime salesStart;
    private LocalDateTime salesEnd;
    @NotNull private EventStatusEnum status;
    @NotEmpty @Valid private List<CreateTicketTypeRequestDto> ticketTypes;
}
