package com.threeheads.apigateway.auth.service;

import com.threeheads.apigateway.feign.UserFeignClient;
import com.threeheads.library.entity.User;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserFeignClient userFeignClient;

    public UserService(UserFeignClient userFeignClient) {
        this.userFeignClient = userFeignClient;
    }

    public User findByEmail(String email) {
        return userFeignClient.findByEmail(email);
    }

    public User registerUser(User user) {
        return userFeignClient.registerUser(user);
    }
}