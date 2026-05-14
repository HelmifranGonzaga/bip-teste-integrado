package com.example.backend.adapter.inbound.web.testconfig;

import com.example.backend.adapter.inbound.web.UserController;
import com.example.backend.adapter.inbound.web.exception.ApiExceptionHandler;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Import;

@SpringBootConfiguration
@Import({UserController.class, ApiExceptionHandler.class})
public class UserWebMvcSliceTestApplication {}
