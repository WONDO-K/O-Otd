//package com.threeheads.user.kafka.consumer.config;
//
//import com.threeheads.user.kafka.entity.KafkaEntity;
//import lombok.AllArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.messaging.MessageHeaders;
//import org.springframework.messaging.handler.annotation.Headers;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.stereotype.Component;
//
//@Slf4j
//@Component
//@AllArgsConstructor
//public class KafkaConsumerCluster {
//    //TODO : 토픽명, 소비자그룹 명 설정
//    @KafkaListener(topics = "${spring.kafka.template.from_battle_to_user}",groupId = "${spring.kafka.consumer.group-user}")
//    public void fromBattle(@Payload KafkaEntity message, @Headers MessageHeaders messageHeaders){
//        log.info("from Battle to User consumer:seccess >> message:{},headers:{}",message.toString(),messageHeaders);
//        // TODO: 여기서 필요한 service 주입 받아 사용
//    }
//
//    @KafkaListener(topics = "${spring.kafka.template.from_gallery_to_user}",groupId = "${spring.kafka.consumer.group-user}")
//    public void fromGallery(@Payload KafkaEntity message, @Headers MessageHeaders messageHeaders){
//        log.info("from Gallery to User consumer:seccess >> message:{},headers:{}",message.toString(),messageHeaders);
//        // TODO: 여기서 필요한 service 주입 받아 사용
//    }
//
//}
