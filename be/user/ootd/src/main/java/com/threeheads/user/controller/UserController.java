package com.threeheads.user.controller;

import com.threeheads.user.entity.User;
import com.threeheads.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/user-service")
@Tag(name = "UserController", description = "유저 관련 API")
public class UserController {

    private final UserService userService;
    private final Logger log = LoggerFactory.getLogger(getClass());


}
