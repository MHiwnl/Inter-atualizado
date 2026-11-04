package com.taskgo.api;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacaoRepository extends JpaRepository<Notificacao,String>{
    void deleteByUsuarioId(Long usuarioId);
    List<Notificacao> findByUsuarioIdOrderByCriadaEmDesc(Long usuarioId);
    List<Notificacao> findByUsuarioIdAndLidaEmIsNull(Long usuarioId);
    long countByUsuarioIdAndLidaEmIsNull(Long usuarioId);
    Optional<Notificacao> findByIdAndUsuarioId(String id,Long usuarioId);
    Optional<Notificacao> findByUsuarioIdAndChaveEvento(Long usuarioId,String chaveEvento);
    boolean existsByUsuarioIdAndChaveEvento(Long usuarioId,String chaveEvento);
}
