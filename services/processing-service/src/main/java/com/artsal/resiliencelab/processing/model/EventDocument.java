package com.artsal.resiliencelab.processing.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "events")
public class EventDocument {

    @Id
    private String id;

    private String eventId;
    private String type;
    private String userId;

    private String status;

    private long createdAt;
}