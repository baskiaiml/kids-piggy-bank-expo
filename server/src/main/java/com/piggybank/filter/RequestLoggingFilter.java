package com.piggybank.filter;

import com.piggybank.service.LoggingService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@Order(1)
public class RequestLoggingFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    @Autowired
    private LoggingService loggingService;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Generate unique request ID
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        
        // Start time
        long startTime = System.currentTimeMillis();
        
        // Log request start
        logger.info("Request started - ID: {}, Method: {}, URI: {}, IP: {}, User-Agent: {}", 
                requestId, 
                httpRequest.getMethod(), 
                httpRequest.getRequestURI(),
                getClientIpAddress(httpRequest),
                httpRequest.getHeader("User-Agent"));
        
        try {
            // Add request ID to response headers
            httpResponse.setHeader("X-Request-ID", requestId);
            
            // Continue with the filter chain
            chain.doFilter(request, response);
            
        } finally {
            // Calculate duration
            long duration = System.currentTimeMillis() - startTime;
            
            // Log request completion
            logger.info("Request completed - ID: {}, Status: {}, Duration: {}ms", 
                    requestId, 
                    httpResponse.getStatus(), 
                    duration);
            
            // Log API request for audit
            String phoneNumber = extractPhoneNumberFromRequest(httpRequest);
            loggingService.logApiRequest(
                httpRequest.getMethod(),
                httpRequest.getRequestURI(),
                phoneNumber,
                httpResponse.getStatus(),
                duration
            );
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    private String extractPhoneNumberFromRequest(HttpServletRequest request) {
        // Try to extract phone number from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // For now, return "authenticated" - in a real implementation,
            // you would decode the JWT token to get the phone number
            return "authenticated";
        }
        return "anonymous";
    }
} 