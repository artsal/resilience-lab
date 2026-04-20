package com.artsal.resiliencelab.processing.consumer;

import com.artsal.resiliencelab.processing.config.ChaosConfig;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EventConsumer {
    private final ChaosConfig chaosConfig;

    public EventConsumer(ChaosConfig chaosConfig) {
        this.chaosConfig = chaosConfig;
    }

    @KafkaListener(topics = "events-topic", groupId = "resilience-group")
    public void consumeEvent(Map<String, Object> event) {

        System.out.println("📥 Received event: " + event);

        // ⏱️ Delay
        if (chaosConfig.getDelayMs() > 0) {
            try {
                System.out.println("⏱️ Delay: " + chaosConfig.getDelayMs());
                Thread.sleep(chaosConfig.getDelayMs());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        // 💥 Failure
        if (chaosConfig.isFailEnabled() && event.get("retry") == null) {
            event.put("retry", true);
            System.out.println("💥 Simulated failure for event: " + event);
            throw new RuntimeException("Simulated failure");
        }

        System.out.println("✅ Successfully processed event: " + event);
    }

}
