package com.example.backend.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MapStruct mapper bean factory.
 * Provides mapper beans using late binding to work in all contexts.
 */
@Configuration
public class MapperBeanFactory {

  @Bean(name = "beneficioPersistenceMapper")
  @ConditionalOnMissingBean
  public com.example.backend.adapter.outbound.persistence.BeneficioPersistenceMapper beneficioPersistenceMapper() {
    return new com.example.backend.adapter.outbound.persistence.BeneficioPersistenceMapperImpl();
  }
}
