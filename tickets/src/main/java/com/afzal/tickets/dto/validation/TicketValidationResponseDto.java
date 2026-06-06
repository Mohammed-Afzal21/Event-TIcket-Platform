package com.afzal.tickets.dto.validation;
import com.afzal.tickets.domain.enums.TicketValidationMethod;
import com.afzal.tickets.domain.enums.TicketValidationStatusEnum;
import lombok.*;
import java.util.UUID;
@Data @AllArgsConstructor @NoArgsConstructor
public class TicketValidationResponseDto {
    private UUID id;
    private UUID ticketId;
    private TicketValidationStatusEnum status;
    private TicketValidationMethod validationMethod;
}
