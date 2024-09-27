package com.threeheads.ootd.producer;

import com.threeheads.ootd.kafka.entity.KafkaEntity;
import com.threeheads.ootd.kafka.producer.cluster.KafkaProducerCluster;
import com.threeheads.ootd.AbstractTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class ProducerTest extends AbstractTest {
    @Autowired
    private KafkaProducerCluster producer;

    private KafkaEntity message = new KafkaEntity();

    @Test
    public void sendMessageToBattle(){
        message.setId("User");
        message.setMessage("producer: from User to Battle");
        producer.sendMessageBattle(message);
    }

    @Test
    public void sendMessageToGallery(){
        message.setId("User");
        message.setMessage("producer: from User to Gallery");
        producer.sendMessageGallery(message);
    }
}
