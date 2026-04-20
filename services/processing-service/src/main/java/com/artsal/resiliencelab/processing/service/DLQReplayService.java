package com.artsal.resiliencelab.processing.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DLQReplayService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public DLQReplayService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void replayEvent(Map<String, Object> event) {
        System.out.println("🔄 Replaying event: " + event);
        kafkaTemplate.send("events-topic", event);
    }
}