package com.arthursalla.resiliencelab.eventservice.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @GetMapping("/health")
    public String health() {
        return "Resilience Lab Event Service Running 🧪";
    }

    @PostMapping
    public Map<String, String> createEvent(@RequestBody Map<String, Object> request) {

        String eventId = UUID.randomUUID().toString();

        return Map.of(
                "eventId", eventId,
                "status", "RECEIVED",
                "message", "Event accepted for processing"
                     );
    }
}
