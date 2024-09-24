package com.threeheads.ootd.kafka.producer.cluster;

import com.threeheads.ootd.kafka.entity.KafkaEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Slf4j  // 로그 기능을 위한 Lombok 애노테이션, log 객체가 자동 생성됨
@Component  // Spring의 Bean으로 등록, 의존성 주입 등을 가능하게 함
@RequiredArgsConstructor  // final 필드를 초기화하는 생성자를 자동으로 생성
public class KafkaProducerCluster {
    // Kafka 메시지를 전송하기 위한 KafkaTemplate, 의존성 주입을 통해 초기화
    private final KafkaTemplate<String, KafkaEntity> kafkaTemplate;

    // Kafka 토픽 이름을 application.properties에서 가져와 사용
    // battle로 보내는 topic
    @Value("${spring.kafka.template.from_user_to_battle}")
    private String toBattle;

    // gallery로 보내는 topic
    @Value("${spring.kafka.template.from_user_to_gallery}")
    private String toGallery;

    // battle에 메시지를 전송하는 메서드
    public void sendMessageBattle(KafkaEntity kafkaEntity){
        // 메시지 객체를 생성, payload로 KafkaEntity를 설정하고, 헤더에 토픽 이름을 설정
        Message<KafkaEntity> message = MessageBuilder
                .withPayload(kafkaEntity)
                .setHeader(KafkaHeaders.TOPIC, toBattle)
                .build();

        // 메시지를 Kafka로 비동기 전송, 결과를 나타내는 CompletableFuture 반환
        CompletableFuture<SendResult<String, KafkaEntity>> future = kafkaTemplate.send(message);

        // 메시지 전송 완료 후 콜백 처리
        future.whenComplete((result, ex) -> {
            if (ex == null) {
                // 성공적으로 전송된 경우, 메시지와 오프셋 정보 로깅
                log.info("from user to battle producer: success >>> message: {}, offset: {}",
                        result.getProducerRecord().value().toString(),
                        result.getRecordMetadata().offset());
            } else {
                // 전송 실패한 경우, 예외 메시지 로깅
                log.info("from user to battle producer: failure >>> message: {}", ex.getMessage());
            }
        });
    }

    // Gallery에 메시지를 전송하는 메서드
    public void sendMessage(KafkaEntity kafkaEntity){
        // 메시지 객체를 생성, payload로 KafkaEntity를 설정하고, 헤더에 토픽 이름을 설정
        Message<KafkaEntity> message = MessageBuilder
                .withPayload(kafkaEntity)
                .setHeader(KafkaHeaders.TOPIC, toGallery)
                .build();

        // 메시지를 Kafka로 비동기 전송, 결과를 나타내는 CompletableFuture 반환
        CompletableFuture<SendResult<String, KafkaEntity>> future = kafkaTemplate.send(message);

        // 메시지 전송 완료 후 콜백 처리
        future.whenComplete((result, ex) -> {
            if (ex == null) {
                // 성공적으로 전송된 경우, 메시지와 오프셋 정보 로깅
                log.info("from user to gallery producer: success >>> message: {}, offset: {}",
                        result.getProducerRecord().value().toString(),
                        result.getRecordMetadata().offset());
            } else {
                // 전송 실패한 경우, 예외 메시지 로깅
                log.info("from user to gallery producer: failure >>> message: {}", ex.getMessage());
            }
        });
    }
}
