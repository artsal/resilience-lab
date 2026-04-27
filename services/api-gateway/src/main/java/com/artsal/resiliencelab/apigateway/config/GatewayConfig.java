package com.artsal.resiliencelab.apigateway.config;


import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfig {

    @Bean
    public GlobalFilter loggingFilter() {
        return (exchange, chain) -> {

            String path = exchange.getRequest().getURI().getPath();

            // Ignore noisy endpoints
            if (path.contains("/api/events") || path.contains("/api/chaos")) {
                return chain.filter(exchange);
            }

            System.out.println("➡️ Incoming request: " + path);

            return chain.filter(exchange).then(
                    Mono.fromRunnable(() ->
                                    System.out.println("⬅️ Response status: " + exchange.getResponse().getStatusCode())
                                     )
                                              );
        };
    }
}
