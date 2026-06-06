package com.afzal.tickets.dto.validation;
import com.afzal.tickets.domain.enums.TicketValidationMethod;
import lombok.*;
import java.util.UUID;
@Data @AllArgsConstructor @NoArgsConstructor
public class TicketValidationRequestDto {
    private UUID id;
    private TicketValidationMethod method;
}
