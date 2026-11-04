package com.taskgo.api;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name="contatos_site")
public class Contato {
    @Id private String id;
    @Column(nullable=false) private String nome;
    @Column(nullable=false) private String email;
    @Column(nullable=false) private String assunto;
    @Column(columnDefinition="text",nullable=false) private String mensagem;
    @Column(nullable=false) private long criadaEm;
    @Column(nullable=false) private String status="registrada";
    @Column(nullable=false) private String emailStatus="nao_configurado";
    protected Contato(){}
    public Contato(String id,String nome,String email,String assunto,String mensagem,long criadaEm){this.id=id;this.nome=nome;this.email=email;this.assunto=assunto;this.mensagem=mensagem;this.criadaEm=criadaEm;}
    public String getId(){return id;}public String getNome(){return nome;}public String getEmail(){return email;}public String getAssunto(){return assunto;}public String getMensagem(){return mensagem;}public long getCriadaEm(){return criadaEm;}public String getStatus(){return status;}public String getEmailStatus(){return emailStatus;}
}
