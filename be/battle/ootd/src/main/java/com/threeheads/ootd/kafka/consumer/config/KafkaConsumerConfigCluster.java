package com.threeheads.ootd.kafka.consumer.config;

import com.threeheads.ootd.kafka.entity.KafkaEntity;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfigCluster {
    // kafka 서버 주소 application.properties 파일에서 들고 옴
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapAddress;

    // TODO: 소비자 그훕 ID 설정
    // Kafka 소비자 그룹 ID를 application.properties 파일에서 들고 옴
    @Value("${spring.kafka.consumer.group-id-battle-user}")
    private String battleuser;

    @Value("${spring.kafka.consumer.group-id-battle-gallery}")
    private String battlegallery;

    // KafkaEntity 타입의 메시지를 소비하기 위한 ConsumerFactory를 생성하는 Bean
    // ConsumerFactory for Battle User
    @Bean
    public ConsumerFactory<String, KafkaEntity> pushEntityBattleUserFactory() {
        // KafkaEntity를 역직렬화하는 데 사용할 JsonDeserializer 객체를 생성
        JsonDeserializer<KafkaEntity> deserializer = gcmPushEntityJsonDeserializer();
        // 생성한 JsonDeserializer와 설정값들을 사용해 DefaultKafkaConsumerFactory 객체를 반환
        return new DefaultKafkaConsumerFactory<>(
                battleUserConsumerFactoryConfig(deserializer),
                new StringDeserializer(), // 키를 위한 디시리얼라이저 (String 타입)
                deserializer);            // 값을 위한 디시리얼라이저 (KafkaEntity 타입)
    }

    // ConsumerFactory for Battle Gallery
    @Bean
    public ConsumerFactory<String, KafkaEntity> pushEntityBattleGalleryFactory() {
        // KafkaEntity를 역직렬화하는 데 사용할 JsonDeserializer 객체를 생성
        JsonDeserializer<KafkaEntity> deserializer = gcmPushEntityJsonDeserializer();
        // 생성한 JsonDeserializer와 설정값들을 사용해 DefaultKafkaConsumerFactory 객체를 반환
        return new DefaultKafkaConsumerFactory<>(
                battleGalleryConsumerFactoryConfig(deserializer),
                new StringDeserializer(), // 키를 위한 디시리얼라이저 (String 타입)
                deserializer);            // 값을 위한 디시리얼라이저 (KafkaEntity 타입)
    }


    // ConsumerFactory를 구성하는 설정값들을 Map으로 반환하는 메서드
    // user에서 batlle로 보낼때 사용하는 consumergroup 설정
    private Map<String, Object> battleUserConsumerFactoryConfig(JsonDeserializer<KafkaEntity> deserializer) {
        Map<String, Object> props = new HashMap<>();
        // Kafka 서버 주소 설정
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
        // Kafka 소비자 그룹 ID 설정
        props.put(ConsumerConfig.GROUP_ID_CONFIG, battleuser);
        // 메시지 키를 직렬화/역직렬화하는 클래스 설정 (String 타입)
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        // 메시지 값을 직렬화/역직렬화하는 클래스 설정 (KafkaEntity 타입)
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer);
        return props;
    }

    // gallelry에서 batlle로 보낼때 사용하는 consumergroup 설정
    private Map<String, Object> battleGalleryConsumerFactoryConfig(JsonDeserializer<KafkaEntity> deserializer) {
        Map<String, Object> props = new HashMap<>();
        // Kafka 서버 주소 설정
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
        // Kafka 소비자 그룹 ID 설정
        props.put(ConsumerConfig.GROUP_ID_CONFIG, battleuser);
        // 메시지 키를 직렬화/역직렬화하는 클래스 설정 (String 타입)
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        // 메시지 값을 직렬화/역직렬화하는 클래스 설정 (KafkaEntity 타입)
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer);
        return props;
    }

    // KafkaEntity 객체를 역직렬화하는 JsonDeserializer를 설정하는 메서드
    private JsonDeserializer<KafkaEntity> gcmPushEntityJsonDeserializer() {
        // KafkaEntity 타입의 JsonDeserializer를 생성
        JsonDeserializer<KafkaEntity> deserializer = new JsonDeserializer<>(KafkaEntity.class);
        // 타입 헤더를 제거하지 않도록 설정
        deserializer.setRemoveTypeHeaders(false);
        // 신뢰할 수 있는 패키지 설정 (여기서는 모든 패키지를 신뢰)
        deserializer.addTrustedPackages("*");
        // 타입 정보를 키에도 사용하도록 설정
        deserializer.setUseTypeMapperForKey(true);
        return deserializer;
    }

    // User에서 Battle로 들어오는 Kafka 메시지를 처리하는 Listener 컨테이너 팩토리를 생성하는 Bean
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, KafkaEntity>
    battleUserKafkaListenerContainerFactory() {
        // 새로운 ConcurrentKafkaListenerContainerFactory 객체 생성
        ConcurrentKafkaListenerContainerFactory<String, KafkaEntity> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        // 위에서 생성한 ConsumerFactory를 사용하도록 설정
        factory.setConsumerFactory(pushEntityBattleUserFactory());
        return factory;
    }

    // gallery에서 Battle로 들오어는 Kafka 메시지를 처리하는 Listener 컨테이너 팩토리를 생성하는 Bean
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, KafkaEntity>
    battleGalleryKafkaListenerContainerFactory() {
        // 새로운 ConcurrentKafkaListenerContainerFactory 객체 생성
        ConcurrentKafkaListenerContainerFactory<String, KafkaEntity> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        // 위에서 생성한 ConsumerFactory를 사용하도록 설정
        factory.setConsumerFactory(pushEntityBattleGalleryFactory());
        return factory;
    }
}
