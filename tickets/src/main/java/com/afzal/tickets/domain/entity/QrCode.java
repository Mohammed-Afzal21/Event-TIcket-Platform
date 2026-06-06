package com.afzal.tickets.domain.entity;

import com.afzal.tickets.domain.enums.QrCodeStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "qr_codes")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QrCode {

    @Id
    // No @GeneratedValue — ID is set manually to the UUID encoded in the QR image
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QrCodeStatusEnum status;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QrCode qrCode)) return false;
        return Objects.equals(id, qrCode.id)
            && Objects.equals(status, qrCode.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, status);
    }
}
