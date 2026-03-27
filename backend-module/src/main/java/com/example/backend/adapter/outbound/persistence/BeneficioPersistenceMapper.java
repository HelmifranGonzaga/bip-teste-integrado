package com.example.backend.adapter.outbound.persistence;

import com.example.backend.domain.model.Beneficio;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BeneficioPersistenceMapper {

    Beneficio toDomain(com.example.ejb.Beneficio entity);

    com.example.ejb.Beneficio toEntity(Beneficio domain);
}