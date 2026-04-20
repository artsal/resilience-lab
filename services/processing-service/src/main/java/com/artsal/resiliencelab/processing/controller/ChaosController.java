package com.artsal.resiliencelab.processing.controller;

import com.artsal.resiliencelab.processing.config.ChaosConfig;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chaos")
public class ChaosController {

    private final ChaosConfig chaosConfig;

    public ChaosController(ChaosConfig chaosConfig) {
        this.chaosConfig = chaosConfig;
    }

    @PostMapping("/failure")
    public String toggleFailure(@RequestParam boolean enabled) {
        chaosConfig.setFailEnabled(enabled);
        return "Failure mode: " + enabled;
    }

    @PostMapping("/delay")
    public String setDelay(@RequestParam int ms) {
        chaosConfig.setDelayMs(ms);
        return "Delay set to " + ms + " ms";
    }

    @GetMapping
    public ChaosConfig getState() {
        return chaosConfig;
    }
}
