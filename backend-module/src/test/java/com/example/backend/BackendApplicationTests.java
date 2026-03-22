package com.example.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class BackendApplicationTests extends BaseIntegrationTest {

    @Test
    void contextLoads() {
    }
}
