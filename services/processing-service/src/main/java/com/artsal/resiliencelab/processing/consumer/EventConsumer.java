package com.artsal.resiliencelab.processing.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EventConsumer {
    @KafkaListener(topics = "events-topic", groupId = "resilience-group")
    public void consumeEvent(Map<String, Object> event) {
        System.out.println("🔥 Received event: " + event);
    }
}
