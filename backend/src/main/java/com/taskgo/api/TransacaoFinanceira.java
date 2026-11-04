package com.taskgo.api;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "transacoes_financeiras")
public class TransacaoFinanceira {
    @Id private String id;
    @Column(name = "usuario_id", nullable = false) private Long usuarioId;
    @Column(nullable = false, length = 40) private String tipo;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal valor;
    @Column(nullable = false, length = 3) private String moeda = "BRL";
    @Column(nullable = false, length = 30) private String status;
    @Column(length = 300) private String referencia;
    @Column(name = "criada_em", nullable = false) private long criadaEm;

    protected TransacaoFinanceira() {}
    public TransacaoFinanceira(String id, Long usuarioId, String tipo, BigDecimal valor, String status, String referencia, long criadaEm) {
        this.id=id; this.usuarioId=usuarioId; this.tipo=tipo; this.valor=valor; this.status=status; this.referencia=referencia; this.criadaEm=criadaEm;
    }
    public String getId(){return id;} public Long getUsuarioId(){return usuarioId;} public String getTipo(){return tipo;}
    public BigDecimal getValor(){return valor;} public String getMoeda(){return moeda;} public String getStatus(){return status;}
    public String getReferencia(){return referencia;} public long getCriadaEm(){return criadaEm;}
}
