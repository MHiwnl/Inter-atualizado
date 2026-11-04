package com.taskgo.api;

import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TokenRecuperacaoSenhaRepository extends JpaRepository<TokenRecuperacaoSenha,String> {
    void deleteByUsuarioId(Long usuarioId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from TokenRecuperacaoSenha t where t.tokenHash=:hash")
    Optional<TokenRecuperacaoSenha> findByHashForUpdate(@Param("hash") String hash);
}
