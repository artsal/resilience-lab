package com.artsal.resiliencelab.processing.controller;

import com.artsal.resiliencelab.processing.service.DLQReplayService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
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
