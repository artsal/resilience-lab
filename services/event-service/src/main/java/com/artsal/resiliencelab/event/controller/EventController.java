package com.artsal.resiliencelab.event.controller;

import com.artsal.resiliencelab.event.producer.EventProducer;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventProducer eventProducer;

    public EventController(EventProducer eventProducer) {
        this.eventProducer = eventProducer;
    }

    @PostMapping
    public String sendEvent(@RequestBody Map<String, Object> event) {
        eventProducer.sendEvent(event);
        return "Event sent";
    }

    @PostMapping("/bulk")
    public String generateBulk(@RequestParam int count) {

        for (int i = 0; i < count; i++) {

            Map<String, Object> event = new HashMap<>();
            event.put("type", "USER_SIGNUP");

            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", "User-" + i);

            event.put("payload", payload);

            eventProducer.sendEvent(event);
        }

        return "Generated " + count + " events";
    }
}
