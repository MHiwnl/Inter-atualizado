package com.taskgo.api;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiStatusController {
    @GetMapping("/")
    public Map<String, String> status() {
        return Map.of("application", "TaskGO API", "status", "running", "health", "/actuator/health");
    }
}
