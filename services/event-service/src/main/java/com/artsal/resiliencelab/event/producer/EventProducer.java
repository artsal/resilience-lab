package com.artsal.resiliencelab.event.producer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.javapoet.ClassName;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class EventProducer {

    private static final Logger log = LoggerFactory.getLogger(ClassName.class); // <-- for better logging context

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public EventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendEvent(Map<String, Object> event) {
        event.put("eventId", UUID.randomUUID().toString());
        kafkaTemplate.send("events-topic", event);
        log.info("Event published: {}", event);
    }

}
