package com.threeheads.ootd.kafka.consumer.cluster;

import com.threeheads.ootd.kafka.entity.KafkaEntity;
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
    // User가 보내는 메세지 모두 듣기
    @KafkaListener(topics = "${spring.kafka.template.from-user-to-battle}",groupId = "${spring.kafka.consumer.group-battle}")
    public void fromUser(@Payload KafkaEntity message, @Headers MessageHeaders messageHeaders){
        log.info("from_user_consumer:seccess >> message:{},headers:{}",message.toString(),messageHeaders);
        // TODO: 여기서 필요한 service 주입 받아 사용
    }
    // Gallery가 보내는 메세지 모두 듣기
    @KafkaListener(topics = "${spring.kafka.template.from-gallery-to-battle}",groupId = "${spring.kafka.consumer.group-battle}")
    public void fromGallery(@Payload KafkaEntity message, @Headers MessageHeaders messageHeaders){
        log.info("from_user_consumer:seccess >> message:{},headers:{}",message.toString(),messageHeaders);
        // TODO: 여기서 필요한 service 주입 받아 사용
    }
}