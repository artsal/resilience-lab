package com.artsal.resiliencelab.processing.controller;

import com.artsal.resiliencelab.processing.service.DLQReplayService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/replay")
public class ReplayController {

    private final DLQReplayService replayService;

    public ReplayController(DLQReplayService replayService) {
        this.replayService = replayService;
    }

    @PostMapping
    public String replay(@RequestBody Map<String, Object> event) {
        replayService.replayEvent(event);
        return "Replay triggered";
    }
}
