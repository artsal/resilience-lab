package com.artsal.resiliencelab.processing.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DLQConsumer {
    @KafkaListener(topics = "events-topic-dlq", groupId = "dlq-group")
    public void consumeDLQ(Map<String, Object> event) {
        System.out.println("📦 DLQ received event: " + event);
    }
}