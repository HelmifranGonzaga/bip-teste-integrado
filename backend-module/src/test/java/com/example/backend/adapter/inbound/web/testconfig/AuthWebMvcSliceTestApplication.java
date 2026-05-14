package com.example.backend.adapter.inbound.web.testconfig;

import com.example.backend.adapter.inbound.web.AuthController;
import com.example.backend.adapter.inbound.web.exception.ApiExceptionHandler;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Import;

@SpringBootConfiguration
@Import({AuthController.class, ApiExceptionHandler.class})
public class AuthWebMvcSliceTestApplication {}
