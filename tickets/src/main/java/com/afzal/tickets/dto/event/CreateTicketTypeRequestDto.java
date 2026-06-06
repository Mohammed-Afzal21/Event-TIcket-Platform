package com.afzal.tickets.dto.event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Data @AllArgsConstructor @NoArgsConstructor
public class CreateTicketTypeRequestDto {
    @NotBlank private String name;
    @NotNull private Double price;
    private String description;
    private Integer totalAvailable;
}
