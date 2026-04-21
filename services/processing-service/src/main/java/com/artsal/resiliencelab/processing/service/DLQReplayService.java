package com.artsal.resiliencelab.processing.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.javapoet.ClassName;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DLQReplayService {

    private static final Logger log = LoggerFactory.getLogger(ClassName.class); // <-- for better logging context

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final EventService eventService;

    public DLQReplayService(KafkaTemplate<String, Object> kafkaTemplate,
                            EventService eventService) {
        this.kafkaTemplate = kafkaTemplate;
        this.eventService = eventService;
    }

    public void replayEvent(Map<String, Object> event) {

        String eventId = (String) event.get("eventId");

        log.info("🔄 Replaying event with ID: {}", eventId);

        // 🔥 REBUILD ORIGINAL EVENT STRUCTURE
        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", event.get("userId"));

        Map<String, Object> newEvent = new HashMap<>();
        newEvent.put("eventId", eventId);
        newEvent.put("type", event.get("type"));
        newEvent.put("payload", payload);

        // mark replay
        newEvent.put("replayed", true);

        eventService.updateStatus(eventId, "REPLAYING");

        try {
            kafkaTemplate.send("events-topic", eventId, newEvent).get();
            log.info("✅ Successfully re-published event to Kafka with ID: {}", eventId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}