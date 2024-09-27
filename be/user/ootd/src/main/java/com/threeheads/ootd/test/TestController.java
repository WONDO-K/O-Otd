package com.threeheads.ootd.test;

import com.threeheads.ootd.kafka.entity.KafkaEntity;
import com.threeheads.ootd.kafka.producer.cluster.KafkaProducerCluster;
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
