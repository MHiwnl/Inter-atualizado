package com.taskgo.api;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import org.hibernate.annotations.Check;
import java.math.BigDecimal;

@Entity
@Table(name = "carteiras", uniqueConstraints = @UniqueConstraint(name = "uk_carteira_usuario", columnNames = "usuario_id"))
@Check(constraints = "saldo_disponivel >= 0 and saldo_pendente >= 0 and saldo_bloqueado >= 0")
public class Carteira {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(name = "saldo_disponivel", nullable = false, precision = 19, scale = 2)
    private BigDecimal saldoDisponivel = BigDecimal.ZERO.setScale(2);
    @Column(name = "saldo_pendente", nullable = false, precision = 19, scale = 2)
    private BigDecimal saldoPendente = BigDecimal.ZERO.setScale(2);
    @Column(name = "saldo_bloqueado", nullable = false, precision = 19, scale = 2)
    private BigDecimal saldoBloqueado = BigDecimal.ZERO.setScale(2);
    @Version private long versao;

    protected Carteira() {}
    public Carteira(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public BigDecimal getSaldoDisponivel() { return saldoDisponivel; }
    public BigDecimal getSaldoPendente() { return saldoPendente; }
    public BigDecimal getSaldoBloqueado() { return saldoBloqueado; }
    public void reservar(BigDecimal valor) {
        if (valor == null || valor.signum() <= 0 || saldoDisponivel.compareTo(valor) < 0)
            throw new IllegalArgumentException("Saldo disponível insuficiente.");
        saldoDisponivel = saldoDisponivel.subtract(valor);
        saldoBloqueado = saldoBloqueado.add(valor);
    }
}
