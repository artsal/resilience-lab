package com.artsal.resiliencelab.processing.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
public class ChaosConfig {

    private volatile boolean failEnabled = false;
    private volatile int delayMs = 0;

}
