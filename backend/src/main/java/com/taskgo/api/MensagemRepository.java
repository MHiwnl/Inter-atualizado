package com.taskgo.api;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensagemRepository extends JpaRepository<Mensagem, String> {
    List<Mensagem> findByPedidoIdOrderByCriadaEmAsc(String pedidoId);
    List<Mensagem> findByPedidoIdAndDestinatarioIdAndLidaEmIsNull(String pedidoId, Long destinatarioId);
    Optional<Mensagem> findByAutorIdAndClientMessageId(Long autorId, String clientMessageId);
    void deleteByPedidoIdIn(List<String> pedidoIds);
}
