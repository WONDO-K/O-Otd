package com.threeheads.battle.dto.reqeust;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BattleRequestDto {
    private Long requesterId;  // 신청자의 사용자 ID
    private String requesterName;  // 신청자 이름
    private String requesterImage;  // 신청자의 이미지 URL
    private Long responderId;  // 수신자의 사용자 ID (배틀 대상자)
    private String responderName;  // 수신자 이름 
}