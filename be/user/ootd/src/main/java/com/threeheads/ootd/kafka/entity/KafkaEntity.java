package com.threeheads.ootd.kafka.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KafkaEntity {
    private String id;
    private String message;
    // 필요시 추가
}
