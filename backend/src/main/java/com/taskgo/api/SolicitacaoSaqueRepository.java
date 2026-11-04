package com.taskgo.api;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoSaqueRepository extends JpaRepository<SolicitacaoSaque,String> {
    Optional<SolicitacaoSaque> findByUsuarioIdAndChaveIdempotencia(Long usuarioId,String chaveIdempotencia);
    List<SolicitacaoSaque> findByUsuarioIdOrderByCriadaEmDesc(Long usuarioId);
}
