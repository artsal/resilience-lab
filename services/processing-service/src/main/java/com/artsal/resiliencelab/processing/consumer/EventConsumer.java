package com.artsal.resiliencelab.processing.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;

@Service
public class EventConsumer {
    private final Random random = new Random();

    @KafkaListener(topics = "events-topic", groupId = "resilience-group")
    public void consumeEvent(Map<String, Object> event) {

        System.out.println("📥 Received event: " + event);

        // 🔥 Random failure (50% chance)
        if (random.nextBoolean()) {
            System.out.println("💥 Simulated failure for event: " + event.get("eventId"));
            throw new RuntimeException("Simulated failure");
        }

        System.out.println("✅ Successfully processed event: " + event.get("eventId"));
    }

}
