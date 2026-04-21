package com.artsal.resiliencelab.processing.consumer;

import com.artsal.resiliencelab.processing.config.ChaosConfig;
import com.artsal.resiliencelab.processing.service.EventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.javapoet.ClassName;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EventConsumer {

    private static final Logger log = LoggerFactory.getLogger(ClassName.class); // <-- for better logging context
    private final ChaosConfig chaosConfig;
    private final EventService eventService;

    public EventConsumer(ChaosConfig chaosConfig, EventService eventService) {
        this.chaosConfig = chaosConfig;
        this.eventService = eventService;
    }

    @KafkaListener(topics = "events-topic", groupId = "resilience-group")
    public void consumeEvent(Map<String, Object> event) {

        log.info("📥 Received event: {}", event);

        // ✅ Validate event structure FIRST
        validateEvent(event);

        String eventId = (String) event.get("eventId");
        String type = (String) event.get("type");

        Map<String, Object> payload = (Map<String, Object>) event.get("payload");
        String userId = (String) payload.get("userId");

        eventService.createIfNotExists(eventId, type, userId);
        eventService.updateStatus(eventId, "PROCESSING");

        // ⏱️ Delay
        if (chaosConfig.getDelayMs() > 0) {
            try {
                log.info("⏱️ Delay: " + chaosConfig.getDelayMs());
                Thread.sleep(chaosConfig.getDelayMs());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        // 🔥 NEW: Detect replay
        boolean isReplay = Boolean.TRUE.equals(event.get("replayed"));

        // 💥 Failure simulation (SKIP for replay)
        if (chaosConfig.isFailEnabled() && !isReplay && event.get("retry") == null) {
            event.put("retry", true);

            eventService.updateStatus(eventId, "FAILED");

            log.warn("💥 Simulated failure for event: {}", eventId);

            throw new RuntimeException("Simulated failure");
        }

        // ✅ SUCCESS (always reached for replay)
        eventService.updateStatus(eventId, "SUCCESS");
        log.info("✅ Successfully processed event with ID: {} (replay: {})", eventId, isReplay);
    }

    // 🔥 Clean validation method
    private void validateEvent(Map<String, Object> event) {

        if (event == null) {
            throw new RuntimeException("Invalid event: event is null");
        }

        if (!event.containsKey("type") || !(event.get("type") instanceof String)) {
            throw new RuntimeException("Invalid event: missing or invalid 'type'");
        }

        if (!event.containsKey("payload") || !(event.get("payload") instanceof Map)) {
            throw new RuntimeException("Invalid event: missing or invalid 'payload'");
        }

        Map<String, Object> payload = (Map<String, Object>) event.get("payload");

        if (!payload.containsKey("userId") || !(payload.get("userId") instanceof String)) {
            throw new RuntimeException("Invalid event: missing or invalid 'userId'");
        }
    }
}