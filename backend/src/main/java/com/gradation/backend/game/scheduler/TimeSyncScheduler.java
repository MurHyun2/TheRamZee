package com.gradation.backend.game.scheduler;

import com.gradation.backend.game.model.response.TimeSyncResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class TimeSyncScheduler {

    private final SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 30000)
    public void broadCastServerTime() {
        Long serverTime = Instant.now().toEpochMilli();
        TimeSyncResponse message = new TimeSyncResponse(serverTime);

        messagingTemplate.convertAndSend("/topic/server-time", message);
    }
}