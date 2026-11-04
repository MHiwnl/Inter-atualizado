package com.taskgo.api;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity @Table(name="tokens_recuperacao_senha")
public class TokenRecuperacaoSenha {
    @Id private String id;
    @Column(name="usuario_id",nullable=false) private Long usuarioId;
    @Column(name="token_hash",nullable=false,unique=true,length=64) private String tokenHash;
    @Column(name="criado_em",nullable=false) private Instant criadoEm;
    @Column(name="expira_em",nullable=false) private Instant expiraEm;
    @Column(name="usado_em") private Instant usadoEm;
    protected TokenRecuperacaoSenha(){}
    public TokenRecuperacaoSenha(String id,Long usuarioId,String tokenHash,Instant criadoEm,Instant expiraEm){this.id=id;this.usuarioId=usuarioId;this.tokenHash=tokenHash;this.criadoEm=criadoEm;this.expiraEm=expiraEm;}
    public String getId(){return id;} public Long getUsuarioId(){return usuarioId;} public String getTokenHash(){return tokenHash;}
    public Instant getExpiraEm(){return expiraEm;} public Instant getUsadoEm(){return usadoEm;} public void marcarUsado(Instant agora){usadoEm=agora;}
    public boolean validoEm(Instant agora){return usadoEm==null&&agora.isBefore(expiraEm);}
}
