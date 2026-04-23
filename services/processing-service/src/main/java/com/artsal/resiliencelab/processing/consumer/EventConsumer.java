package com.artsal.resiliencelab.processing.consumer;

import com.artsal.resiliencelab.processing.config.ChaosConfig;
import com.artsal.resiliencelab.processing.service.EventService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EventConsumer {

    private static final Logger log = LoggerFactory.getLogger(EventConsumer.class);

    private final ChaosConfig chaosConfig;
    private final EventService eventService;

    // 🔥 Metrics
    private final Counter processedCounter;
    private final Counter failedCounter;

    public EventConsumer(ChaosConfig chaosConfig,
                         EventService eventService,
                         MeterRegistry registry) {

        this.chaosConfig = chaosConfig;
        this.eventService = eventService;

        // ✅ Prometheus counters
        this.processedCounter = registry.counter("events_processed_total");
        this.failedCounter = registry.counter("events_failed_total");
    }

    @KafkaListener(topics = "events-topic", groupId = "resilience-group")
    public void consumeEvent(Map<String, Object> event) {

        log.info("📥 Received event: {}", event);

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
                Thread.sleep(chaosConfig.getDelayMs());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        boolean isReplay = Boolean.TRUE.equals(event.get("replayed"));

        // 💥 Simulated failure (counts as failed attempt)
        if (chaosConfig.isFailEnabled() && !isReplay && event.get("retry") == null) {
            event.put("retry", true);

            eventService.updateStatus(eventId, "FAILED");

            // 🔥 Increment failure metric
            failedCounter.increment();

            log.warn("Simulated failure for event: {}", eventId);

            throw new RuntimeException("Simulated failure");
        }

        // ✅ SUCCESS
        eventService.updateStatus(eventId, "SUCCESS");

        // 🔥 Increment success metric
        processedCounter.increment();

        log.info("Successfully processed event: {} (replay: {})", eventId, isReplay);
    }

    private void validateEvent(Map<String, Object> event) {

        if (event == null) {
            throw new RuntimeException("Invalid event: null");
        }

        if (!event.containsKey("type") || !(event.get("type") instanceof String)) {
            throw new RuntimeException("Invalid event: missing type");
        }

        if (!event.containsKey("payload") || !(event.get("payload") instanceof Map)) {
            throw new RuntimeException("Invalid event: missing payload");
        }

        Map<String, Object> payload = (Map<String, Object>) event.get("payload");

        if (!payload.containsKey("userId") || !(payload.get("userId") instanceof String)) {
            throw new RuntimeException("Invalid event: missing userId");
        }
    }
}