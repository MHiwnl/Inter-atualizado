package com.taskgo.api;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class LoginAttemptLimiter {
    private static final long WINDOW_MS = Duration.ofMinutes(5).toMillis();
    private static final int MAX_ATTEMPTS = 10;
    private final ConcurrentHashMap<String, Window> attempts = new ConcurrentHashMap<>();

    public boolean allowed(String address) {
        long now = System.currentTimeMillis();
        Window window = attempts.compute(address, (key, old) -> old == null || now - old.startedAt >= WINDOW_MS
                ? new Window(now, new AtomicInteger()) : old);
        return window.count.get() < MAX_ATTEMPTS;
    }

    public void failed(String address) {
        long now = System.currentTimeMillis();
        Window window = attempts.compute(address, (key, old) -> old == null || now - old.startedAt >= WINDOW_MS
                ? new Window(now, new AtomicInteger()) : old);
        window.count.incrementAndGet();
        if (attempts.size() > 10_000) attempts.entrySet().removeIf(entry -> now - entry.getValue().startedAt >= WINDOW_MS);
    }

    public void succeeded(String address) { attempts.remove(address); }

    private record Window(long startedAt, AtomicInteger count) {}
}
