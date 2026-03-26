package com.example.backend.adapter.inbound.web.mapper;

import com.example.backend.adapter.inbound.web.dto.BeneficioRequest;
import com.example.backend.adapter.inbound.web.dto.BeneficioResponse;
import com.example.backend.domain.model.Beneficio;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BeneficioMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    Beneficio toDomain(BeneficioRequest request);

    BeneficioResponse toResponse(Beneficio beneficio);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateDomainFromRequest(BeneficioRequest request, @MappingTarget Beneficio beneficio);
}
