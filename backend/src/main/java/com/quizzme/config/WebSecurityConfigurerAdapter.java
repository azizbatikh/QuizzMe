package com.quizzme.config;

import org.springframework.context.annotation.Configuration;

public abstract class WebSecurityConfigurerAdapter implements
                WebSecurityConfigurer<WebSecurity> {

    protected void configure(HttpSecurity http) throws Exception {
            http
                .authorizeRequests()
                    .anyRequest().authenticated()
                    .and()
                .formLogin().and()
                .httpBasic();


    }
}
  