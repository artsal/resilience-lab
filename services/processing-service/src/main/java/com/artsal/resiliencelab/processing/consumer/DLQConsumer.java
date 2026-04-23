package com.artsal.resiliencelab.processing.consumer;

import com.artsal.resiliencelab.processing.service.EventService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.javapoet.ClassName;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DLQConsumer {

    private static final Logger log = LoggerFactory.getLogger(ClassName.class); // <-- for better logging context
    private final EventService eventService;

    // 🔥 Metrics
    private final Counter dlqCounter;

    public DLQConsumer(EventService eventService, MeterRegistry registry) {
        this.eventService = eventService;
        // ✅ Prometheus counters
        this.dlqCounter = registry.counter("events_dlq_total");

    }

    @KafkaListener(topics = "events-topic-dlq", groupId = "dlq-group")
    public void consumeDLQ(Map<String, Object> event) {
        String eventId = (String) event.get("eventId");
        log.warn("Event moved to DLQ: {}", eventId);
        dlqCounter.increment();
        // ✅ ONLY mark DLQ if not already success
        eventService.updateStatus(eventId, "DLQ");
    }
}