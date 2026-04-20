package com.artsal.resiliencelab.processing.consumer;

import com.artsal.resiliencelab.processing.config.ChaosConfig;
import com.artsal.resiliencelab.processing.service.EventService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EventConsumer {

    private final ChaosConfig chaosConfig;
    private final EventService eventService;

    public EventConsumer(ChaosConfig chaosConfig, EventService eventService) {
        this.chaosConfig = chaosConfig;
        this.eventService = eventService;
    }

    @KafkaListener(topics = "events-topic", groupId = "resilience-group")
    public void consumeEvent(Map<String, Object> event) {

        System.out.println("📥 Received event: " + event);

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
                System.out.println("⏱️ Delay: " + chaosConfig.getDelayMs());
                Thread.sleep(chaosConfig.getDelayMs());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        // 💥 Failure simulation
        if (chaosConfig.isFailEnabled() && event.get("retry") == null) {
            event.put("retry", true);
            eventService.updateStatus(eventId, "FAILED");
            System.out.println("💥 Simulated failure: " + eventId);
            throw new RuntimeException("Simulated failure");
        }

        eventService.updateStatus(eventId, "SUCCESS");

        System.out.println("✅ Processed: " + eventId);
    }

    // 🔥 Clean validation method
    private void validateEvent(Map<String, Object> event) {

        if (event == null) {
            throw new RuntimeException("Invalid event: event is null");
        }

        // Validate type
        if (!event.containsKey("type") || !(event.get("type") instanceof String)) {
            throw new RuntimeException("Invalid event: missing or invalid 'type'");
        }

        // Validate payload
        if (!event.containsKey("payload") || !(event.get("payload") instanceof Map)) {
            throw new RuntimeException("Invalid event: missing or invalid 'payload'");
        }

        Map<String, Object> payload = (Map<String, Object>) event.get("payload");

        // Validate userId
        if (!payload.containsKey("userId") || !(payload.get("userId") instanceof String)) {
            throw new RuntimeException("Invalid event: missing or invalid 'userId'");
        }
    }
}