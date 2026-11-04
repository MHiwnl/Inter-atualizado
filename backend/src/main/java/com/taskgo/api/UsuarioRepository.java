package com.taskgo.api;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);

    Optional<Usuario> findByEmailIgnoreCase(String email);

    List<Usuario> findByTipoIgnoreCaseAndServiceIgnoreCaseOrderByNomeAsc(String tipo, String service);
    List<Usuario> findByTipoIgnoreCaseOrderByNomeAsc(String tipo);
}
