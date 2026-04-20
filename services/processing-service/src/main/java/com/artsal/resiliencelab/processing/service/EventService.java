package com.artsal.resiliencelab.processing.service;

import com.artsal.resiliencelab.processing.model.EventDocument;
import com.artsal.resiliencelab.processing.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public void createIfNotExists(String eventId, String type, String userId) {

        Optional<EventDocument> existing = repository.findByEventId(eventId);

        if (existing.isEmpty()) {
            EventDocument doc = new EventDocument();
            doc.setEventId(eventId);
            doc.setType(type);
            doc.setUserId(userId);
            doc.setStatus("PENDING");
            doc.setCreatedAt(System.currentTimeMillis());

            repository.save(doc);
        }
    }

    public void updateStatus(String eventId, String status) {

        repository.findByEventId(eventId).ifPresent(doc -> {
            doc.setStatus(status);
            repository.save(doc);
        });
    }
}