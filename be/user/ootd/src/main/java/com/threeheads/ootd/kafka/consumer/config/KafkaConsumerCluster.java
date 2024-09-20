package com.threeheads.ootd.kafka.consumer.config;

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
    //TODO : 토픽명, 소비자그룹 명 설정
    @KafkaListener(topics = "${spring.kafka.template.test-topic}",groupId = "${spring.kafka.consumer.group-id}")
    public void testtopic(@Payload KafkaEntity message, @Headers MessageHeaders messageHeaders){
        log.info("consumer:seccess >> message:{},headers:{}",message.toString(),messageHeaders);
        // TODO: 여기서 필요한 service 주입 받아 사용
    }

}
