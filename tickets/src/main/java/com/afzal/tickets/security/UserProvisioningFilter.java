package com.afzal.tickets.security;

import com.afzal.tickets.domain.entity.User;
import com.afzal.tickets.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserProvisioningFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
            UUID keycloakId = JwtUtil.parseUserId(jwt);
            String name = jwt.getClaimAsString("preferred_username");
            String email = jwt.getClaimAsString("email");

            if (userRepository.existsById(keycloakId)) {
                // Update existing user to keep in sync with Keycloak
                userRepository.findById(keycloakId).ifPresent(existing -> {
                    existing.setName(name);
                    existing.setEmail(email);
                    userRepository.save(existing);
                });
            } else {
                // Create new user
                User newUser = new User();
                newUser.setId(keycloakId);
                newUser.setName(name);
                newUser.setEmail(email);
                userRepository.save(newUser);
                log.info("Provisioned new user: {}", keycloakId);
            }
        }

        filterChain.doFilter(request, response);
    }
}
