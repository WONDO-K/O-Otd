package com.threeheads.gallery.kafka.test;

import com.threeheads.gallery.kafka.entity.KafkaEntity;
import com.threeheads.gallery.kafka.producer.cluster.KafkaProducerCluster;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class TestController {
    private KafkaProducerCluster producer;

    @PostMapping("/gallery/user")
    public void sendMessageUser(){
        KafkaEntity message = new KafkaEntity();
        message.setMessage("gallery to user");
        message.setId("gallery");
        producer.sendMessageUser(message);
    }

    @PostMapping("/gallery/battle")
    public void sendMessageBattle(){
        KafkaEntity message = new KafkaEntity();
        message.setMessage("gallery to battle");
        message.setId("gallery");
        producer.sendMessageBattle(message);
    }
}
