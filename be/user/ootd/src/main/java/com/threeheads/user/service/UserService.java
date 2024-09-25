package com.threeheads.user.service;

import com.threeheads.user.entity.User;
import reactor.core.publisher.Mono;

public interface UserService {
    Mono<User> findByEmail(String email);

    void registerUser(User user);
}
