package com.taskgo.api;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PedidoRepository extends JpaRepository<PedidoEstimativa, Long> {
    Page<PedidoEstimativa> findByEmailClienteIgnoreCase(String emailCliente, Pageable pageable);
    Page<PedidoEstimativa> findByEmailClienteIgnoreCaseAndServicoIgnoreCase(String emailCliente, String servico, Pageable pageable);

    void deleteByEmailClienteIgnoreCase(String emailCliente);
}
