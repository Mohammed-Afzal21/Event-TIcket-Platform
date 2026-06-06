package com.afzal.tickets.dto.event;
import lombok.*;
import java.util.UUID;
@Data @AllArgsConstructor @NoArgsConstructor
public class ListEventTicketTypeResponseDto {
    private UUID id;
    private String name;
    private Double price;
    private Integer totalAvailable;
}
