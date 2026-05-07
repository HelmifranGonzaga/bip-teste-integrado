package com.example.backend.adapter.outbound.persistence;

import com.example.backend.domain.model.Beneficio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface BeneficioPersistenceMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "descricao", source = "descricao")
    @Mapping(target = "cnpj", source = "cnpj")
    @Mapping(target = "valor", source = "valor")
    @Mapping(target = "ativo", source = "ativo")
    @Mapping(target = "version", source = "version")
    Beneficio toDomain(com.example.ejb.Beneficio entity);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    @Mapping(target = "descricao", source = "descricao")
    @Mapping(target = "cnpj", source = "cnpj")
    @Mapping(target = "valor", source = "valor")
    @Mapping(target = "ativo", source = "ativo")
    @Mapping(target = "version", source = "version")
    com.example.ejb.Beneficio toEntity(Beneficio domain);
}
