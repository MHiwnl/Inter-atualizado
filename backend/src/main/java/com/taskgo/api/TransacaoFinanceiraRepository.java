package com.taskgo.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransacaoFinanceiraRepository extends JpaRepository<TransacaoFinanceira, String> {
    Page<TransacaoFinanceira> findByUsuarioIdOrderByCriadaEmDesc(Long usuarioId, Pageable pageable);
}
