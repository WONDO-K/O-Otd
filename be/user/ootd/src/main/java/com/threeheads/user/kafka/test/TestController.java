package com.threeheads.user.kafka.test;

import com.threeheads.user.kafka.producer.cluster.KafkaProducerCluster;
import com.threeheads.user.kafka.entity.KafkaEntity;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class TestController {
    private KafkaProducerCluster producer;

    @PostMapping("/user/gallery")
    public void sendMessage(){
        KafkaEntity message = new KafkaEntity();
        message.setMessage("user to gallery");
        message.setId("user");
        producer.sendMessageGallery(message);
    }


    @PostMapping("/user/battle")
    public void sendMessageBattle(){
        KafkaEntity message = new KafkaEntity();
        message.setMessage("user to battle");
        message.setId("user");
        producer.sendMessageBattle(message);
    }
}
