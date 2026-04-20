package com.artsal.resiliencelab.processing.consumer;

import com.artsal.resiliencelab.processing.service.EventService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DLQConsumer {

    private final EventService eventService;

    public DLQConsumer(EventService eventService) {
        this.eventService = eventService;
    }

    @KafkaListener(topics = "events-topic-dlq", groupId = "dlq-group")
    public void consumeDLQ(Map<String, Object> event) {

        System.out.println("📦 Event in DLQ: " + event);

        String eventId = (String) event.get("eventId");

        eventService.updateStatus(eventId, "DLQ");
    }
}