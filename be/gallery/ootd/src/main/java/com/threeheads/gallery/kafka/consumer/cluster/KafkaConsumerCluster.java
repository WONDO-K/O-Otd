package com.threeheads.gallery.kafka.consumer.cluster;

import com.threeheads.gallery.kafka.entity.KafkaEntity;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.Headers;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class KafkaConsumerCluster {
    @KafkaListener(topics = "${spring.kafka.template.from-battle-to-gallery}",groupId = "${spring.kafka.consumer.group-gallery}")
    public void fromBattle(@Payload KafkaEntity message, @Headers MessageHeaders messageHeaders){
        log.info("from battle consumer:seccess >> message:{},headers:{}",message.toString(),messageHeaders);
        // TODO: 여기서 필요한 service 주입 받아 사용
    }

    @KafkaListener(topics ="${spring.kafka.template.from-user-to-gallery}",groupId = "${spring.kafka.consumer.group-gallery}")
    public void fromUser(@Payload KafkaEntity message, @Headers MessageHeaders messageHeaders){
        log.info("from user consumer:seccess >> message:{},headers:{}",message.toString(),messageHeaders);
        // TODO: 여기서 필요한 service 주입 받아 사용
    }
}