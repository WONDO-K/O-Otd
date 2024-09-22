package com.threeheads.apigateway.util;

import com.threeheads.apigateway.auth.service.UserService;
import com.threeheads.apigateway.feign.UserFeignClient;
import com.threeheads.library.dto.user.UserDto;
import com.threeheads.library.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component("customUserDetailsService") // userDetailsService이 이미 정의되어 있어서 이름 겹침으로 customUserDetailsService로 변경
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    //private final UserFeignClient userFeignClient;  // UserFeignClient 주입
    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userService.findByEmail(email); // UserDto를 직접 받음

        if (user == null) {
            throw new UsernameNotFoundException(email + " -> DB에서 찾을 수 없습니다.");
        }

        return createUserDetails(user); // UserDto를 기반으로 UserDetails 생성
    }

    private UserDetails createUserDetails(User user) {
        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(user.getRole().toString());

        return new org.springframework.security.core.userdetails.User(
                String.valueOf(user.getId()),
                user.getPasswordHash(),
                Collections.singletonList(grantedAuthority)
        );
    }
}
