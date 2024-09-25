package com.threeheads.ootd.producer;

import com.threeheads.ootd.AbstractTest;
import com.threeheads.ootd.kafka.entity.KafkaEntity;
import com.threeheads.ootd.kafka.producer.cluster.KafkaProducerCluster;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class ProducerTest extends AbstractTest {

    @Autowired
    private KafkaProducerCluster producer;

    private KafkaEntity message = new KafkaEntity();

    @Test
    public void sendMessageToUser(){
        message.setMessage("producer: from gallery to user");
        message.setId("gallery");
        producer.sendMessageUser(message);
    }

    @Test
    public void sendMessageToBattle(){
        message.setMessage("producer: from gallery to battle");
        message.setId("gallery");
        producer.sendMessageBattle(message);
    }
}
