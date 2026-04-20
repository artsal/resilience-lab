package com.artsal.resiliencelab.processing.controller;

import com.artsal.resiliencelab.processing.model.EventDocument;
import com.artsal.resiliencelab.processing.repository.EventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/events")
public class EventQueryController {

    private final EventRepository repository;

    public EventQueryController(EventRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<EventDocument> getAllEvents() {
        return repository.findAll();
    }
}