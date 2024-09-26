package com.threeheads.apigateway.feign;

import com.threeheads.library.entity.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

// Eureka에 등록되어 있기 때문에 name만 있으면 자동으로 url을 조회할 수 있다.
@FeignClient(name = "user-service")
public interface UserFeignClient {
    @GetMapping("/user/findByEmail")
    User findByEmail(@RequestParam String email);

    @PostMapping("/user/register") // 사용자 등록 메서드 추가
    void registerUser(@RequestBody User user);
}