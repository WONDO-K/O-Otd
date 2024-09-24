package com.threeheads.user.service;

import com.threeheads.user.entity.User;

public interface UserService {
    User findByEmail(String email);

    void registerUser(User user);
}
