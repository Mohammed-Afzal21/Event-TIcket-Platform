package com.afzal.tickets.domain.entity;

import com.afzal.tickets.domain.enums.TicketValidationMethod;
import com.afzal.tickets.domain.enums.TicketValidationStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "ticket_validations")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketValidation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketValidationStatusEnum status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketValidationMethod validationMethod;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TicketValidation that)) return false;
        return Objects.equals(id, that.id)
            && Objects.equals(status, that.status)
            && Objects.equals(validationMethod, that.validationMethod);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, status, validationMethod);
    }
}
