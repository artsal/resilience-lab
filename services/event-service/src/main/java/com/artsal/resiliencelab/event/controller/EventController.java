package com.artsal.resiliencelab.event.controller;

import com.artsal.resiliencelab.event.producer.EventProducer;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventProducer eventProducer;

    public EventController(EventProducer eventProducer) {
        this.eventProducer = eventProducer;
    }

    @PostMapping
    public Map<String, String> createEvent(@RequestBody Map<String, Object> request) {

        String eventId = UUID.randomUUID().toString();

        request.put("eventId", eventId);

        // 🔥 Send to Kafka
        eventProducer.sendEvent("events-topic", request);

        return Map.of(
                "eventId", eventId,
                "status", "PUBLISHED",
                "message", "Event sent to Kafka"
                     );
    }


    @GetMapping("/health")
    public String health() {
        return "Resilience Lab Event Service Running 🧪";
    }
}
