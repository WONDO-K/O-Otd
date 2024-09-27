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

    @PostMapping("/battle/gallery")
    public void sendMessage(){
        KafkaEntity message = new KafkaEntity();
        message.setMessage("battle to gallery");
        message.setId("battle");
        producer.sendMessageGallery(message);
    }


    @PostMapping("/battle/user")
    public void sendMessageBattle(){
        KafkaEntity message = new KafkaEntity();
        message.setMessage("battle to user");
        message.setId("battle");
        producer.sendMessageUser(message);
    }
}
