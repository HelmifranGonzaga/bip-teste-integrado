package com.example.backend.adapter.inbound.web.mapper;

import com.example.backend.adapter.inbound.web.dto.BeneficioRequest;
import com.example.backend.adapter.inbound.web.dto.BeneficioResponse;
import com.example.backend.domain.model.Beneficio;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BeneficioMapper {

    Beneficio toDomain(BeneficioRequest request);

    BeneficioResponse toResponse(Beneficio beneficio);

    void updateDomainFromRequest(BeneficioRequest request, @MappingTarget Beneficio beneficio);
}
