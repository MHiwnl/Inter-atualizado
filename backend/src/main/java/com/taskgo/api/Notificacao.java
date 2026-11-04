package com.taskgo.api;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name="notificacoes",uniqueConstraints=@UniqueConstraint(columnNames={"usuario_id","chave_evento"}))
public class Notificacao {
    @Id private String id;
    @Column(name="usuario_id",nullable=false) private Long usuarioId;
    @Column(name="pedido_id") private String pedidoId;
    @Column(name="chave_evento",nullable=false) private String chaveEvento;
    @Column(nullable=false) private String tipo;
    @Column(nullable=false) private String titulo;
    @Column(columnDefinition="text",nullable=false) private String conteudo;
    @Column(nullable=false) private long criadaEm;
    private Long lidaEm;
    @Column(nullable=false) private String canal="in_app";
    @Column(nullable=false) private String statusEntrega="criada";

    protected Notificacao(){}
    public Notificacao(String id,Long usuarioId,String pedidoId,String chaveEvento,String tipo,String titulo,String conteudo,long criadaEm){
        this.id=id;this.usuarioId=usuarioId;this.pedidoId=pedidoId;this.chaveEvento=chaveEvento;this.tipo=tipo;this.titulo=titulo;this.conteudo=conteudo;this.criadaEm=criadaEm;
    }
    public String getId(){return id;} public Long getUsuarioId(){return usuarioId;} public String getPedidoId(){return pedidoId;} public String getTipo(){return tipo;}
    public String getTitulo(){return titulo;} public String getConteudo(){return conteudo;} public long getCriadaEm(){return criadaEm;} public Long getLidaEm(){return lidaEm;}
    public String getCanal(){return canal;} public String getStatusEntrega(){return statusEntrega;} public void marcarLida(long agora){if(lidaEm==null)lidaEm=agora;}
}
