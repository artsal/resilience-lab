package com.artsal.resiliencelab.event.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class EventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public EventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendEvent(Map<String, Object> event) {

        event.put("eventId", UUID.randomUUID().toString());

        kafkaTemplate.send("events-topic", event);

        System.out.println("📤 Sent event: " + event);
    }

}
