package com.taskgo.api;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

public interface PedidoContratadoRepository extends JpaRepository<Pedido, String> {
    @Query("select avg(p.rating), count(p.rating) from Pedido p where lower(p.proEmail)=lower(:email) and lower(p.status)='concluido' and p.rating is not null")
    Object[] resumoAvaliacoes(@Param("email") String email);
    java.util.Optional<Pedido> findByIdAndStatusIgnoreCaseAndProEmailIsNull(String id, String status);
    List<Pedido> findByClientEmailIgnoreCaseOrProEmailIgnoreCaseOrderByCreatedDesc(String clientEmail, String proEmail);
    void deleteByClientEmailIgnoreCaseOrProEmailIgnoreCase(String clientEmail, String proEmail);
    @Query("select p from Pedido p where lower(p.status)=lower(:status) and p.proEmail is null")
    Page<Pedido> encontrarDisponiveis(@Param("status") String status, Pageable pageable);
    @Query("select p from Pedido p where lower(p.status)=lower(:status) and p.proEmail is null and lower(p.service)=lower(:service)")
    Page<Pedido> encontrarDisponiveisPorServico(@Param("status") String status, @Param("service") String service, Pageable pageable);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Pedido p set p.proEmail = :email, p.proId = :proId, p.professionalName = :name, p.status = 'a_caminho', p.acceptedAt = :acceptedAt, p.progress = 0 where p.id = :id and lower(p.status) = 'aguardando' and (p.proEmail is null or lower(p.proEmail) = lower(:email))")
    int aceitarSeDisponivel(@Param("id") String id, @Param("email") String email, @Param("proId") String proId,
                            @Param("name") String name, @Param("acceptedAt") long acceptedAt);
}
