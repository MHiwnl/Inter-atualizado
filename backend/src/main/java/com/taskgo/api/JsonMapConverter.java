package com.taskgo.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.HashMap;
import java.util.Map;

@Converter
public class JsonMapConverter implements AttributeConverter<Map<String, Object>, String> {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    @Override public String convertToDatabaseColumn(Map<String, Object> value) {
        try { return MAPPER.writeValueAsString(value == null ? Map.of() : value); }
        catch (Exception e) { throw new IllegalArgumentException("Não foi possível serializar os dados do pedido", e); }
    }
    @Override public Map<String, Object> convertToEntityAttribute(String value) {
        if (value == null || value.isBlank()) return new HashMap<>();
        try { return MAPPER.readValue(value, new TypeReference<>() {}); }
        catch (Exception e) { throw new IllegalArgumentException("Não foi possível ler os dados adicionais do pedido", e); }
    }
}
