package com.example.demo.hexagonal_architecture.core.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.TaskScheduler;
import java.util.concurrent.ScheduledFuture;

@Service
@RequiredArgsConstructor
public class CounterService {

    private int COUNTER = 30;  // Početna vrednost
    private boolean isActive = true;
    private ScheduledFuture<?> scheduledFuture;
    private final TaskScheduler taskScheduler;

    // Pokreće brojač, smanjuje ga svake sekunde
    public void startCounterTask() {
        if (scheduledFuture == null || scheduledFuture.isCancelled()) {
            scheduledFuture = taskScheduler.scheduleAtFixedRate(this::decrementCounter, 1000);
        }
    }

    // Zaustavlja brojač
    public void stopCounterTask() {
        if (scheduledFuture != null && !scheduledFuture.isCancelled()) {
            scheduledFuture.cancel(true);
        }
    }

    private void decrementCounter() {
        if (isActive && COUNTER > 0) {
            COUNTER--;
            System.out.println("Counter: " + COUNTER);
            if (COUNTER == 0) {
                isActive = false;
                stopCounterTask();
            }
        }
    }

    public int getCounter() {
        return COUNTER;
    }
    public void resetCounter() {
        COUNTER = 30;
        isActive = false;
        System.out.println("Counter na početnu vrednost: " + COUNTER);
    }
}
