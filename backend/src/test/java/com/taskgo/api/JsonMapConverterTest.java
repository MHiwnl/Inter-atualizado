package com.taskgo.api;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class JsonMapConverterTest {
    @Test void preservaDadosExtrasDoPedidoEntreBancoEEntidade() {
        JsonMapConverter converter = new JsonMapConverter();
        Map<String, Object> dados = Map.of("comment", "Serviço concluído", "reviewTags", List.of("Pontual", "Caprichoso"), "trackingStartedAt", 12345);
        String coluna = converter.convertToDatabaseColumn(dados);
        assertEquals(dados, converter.convertToEntityAttribute(coluna));
    }
}
