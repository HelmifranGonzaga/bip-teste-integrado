package com.example.backend.application.service;

import com.example.backend.domain.model.Beneficio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BeneficioUpdateMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    void merge(Beneficio source, @MappingTarget Beneficio target);
}
