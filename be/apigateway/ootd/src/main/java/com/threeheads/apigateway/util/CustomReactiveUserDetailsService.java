package com.threeheads.apigateway.util;

import com.threeheads.apigateway.auth.service.UserClient;
import com.threeheads.library.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Collections;

@Component("customReactiveUserDetailsService")
@RequiredArgsConstructor
public class CustomReactiveUserDetailsService implements ReactiveUserDetailsService {

    private final UserClient userClient;

    @Override
    public Mono<UserDetails> findByUsername(String username) {
        return userClient.findByEmail(username)
                .flatMap(user -> {
                    // user가 null일 경우 처리
                    if (user == null) {
                        return Mono.error(new UsernameNotFoundException(username + " -> DB에서 찾을 수 없습니다."));
                    }
                    return Mono.just(createUserDetails(user));
                });
    }
    private UserDetails createUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                String.valueOf(user.getId()),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().toString()))
        );
    }
}
