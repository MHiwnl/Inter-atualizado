package com.taskgo.api;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "mensagens", uniqueConstraints = @UniqueConstraint(columnNames = {"autor_id", "client_message_id"}))
public class Mensagem {
    @Id private String id;
    @Column(name = "pedido_id", nullable = false) private String pedidoId;
    @Column(name = "autor_id", nullable = false) private Long autorId;
    @Column(name = "destinatario_id") private Long destinatarioId;
    @Column(name = "client_message_id", nullable = false) private String clientMessageId;
    @Column(columnDefinition = "text", nullable = false) private String texto;
    @Column(nullable = false) private long criadaEm;
    private Long lidaEm;
    @Column(nullable = true) private Boolean automatica = Boolean.FALSE;

    protected Mensagem() {}
    public Mensagem(String id, String pedidoId, Long autorId, Long destinatarioId, String clientMessageId, String texto, long criadaEm) {
        this.id=id; this.pedidoId=pedidoId; this.autorId=autorId; this.destinatarioId=destinatarioId; this.clientMessageId=clientMessageId; this.texto=texto; this.criadaEm=criadaEm; this.automatica=false;
    }
    public String getId(){return id;} public String getPedidoId(){return pedidoId;} public Long getAutorId(){return autorId;} public Long getDestinatarioId(){return destinatarioId;}
    public String getClientMessageId(){return clientMessageId;} public String getTexto(){return texto;} public long getCriadaEm(){return criadaEm;} public Long getLidaEm(){return lidaEm;} public boolean isAutomatica(){return Boolean.TRUE.equals(automatica);}
    public void marcarLida(long quando){if(lidaEm==null)lidaEm=quando;}
}
