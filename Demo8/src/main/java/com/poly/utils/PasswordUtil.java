package com.poly.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtil {
	@Bean
	public BCryptPasswordEncoder getBcryBCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
