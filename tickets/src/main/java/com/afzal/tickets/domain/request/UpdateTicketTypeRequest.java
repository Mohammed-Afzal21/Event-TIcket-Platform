package com.afzal.tickets.domain.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTicketTypeRequest {
    private UUID id; // null = create new
    private String name;
    private Double price;
    private String description;
    private Integer totalAvailable;
}
