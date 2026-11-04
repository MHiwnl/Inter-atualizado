package com.taskgo.api;

import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NotificacaoService {
    private final NotificacaoRepository repository;
    public NotificacaoService(NotificacaoRepository repository){this.repository=repository;}

    @Transactional
    public Notificacao criar(Long userId,String pedidoId,String tipo,String titulo,String conteudo,String eventKey){
        var existente=repository.findByUsuarioIdAndChaveEvento(userId,eventKey);
        if(existente.isPresent())return existente.get();
        return repository.save(new Notificacao(UUID.randomUUID().toString(),userId,pedidoId,eventKey,tipo,titulo,conteudo,System.currentTimeMillis()));
    }
    @Transactional(readOnly=true) public List<Notificacao> listar(Long userId){return repository.findByUsuarioIdOrderByCriadaEmDesc(userId);}
    @Transactional(readOnly=true) public long naoLidas(Long userId){return repository.countByUsuarioIdAndLidaEmIsNull(userId);}
    @Transactional public Notificacao marcarLida(Long userId,String id){Notificacao n=repository.findByIdAndUsuarioId(id,userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));n.marcarLida(System.currentTimeMillis());return repository.save(n);}
    @Transactional public void marcarTodas(Long userId){List<Notificacao> pendentes=repository.findByUsuarioIdAndLidaEmIsNull(userId);long now=System.currentTimeMillis();pendentes.forEach(n->n.marcarLida(now));repository.saveAll(pendentes);}
    public record NotificacaoDto(String id,String pedidoId,String tipo,String titulo,String conteudo,long criadaEm,Long lidaEm,String canal,String statusEntrega){static NotificacaoDto from(Notificacao n){return new NotificacaoDto(n.getId(),n.getPedidoId(),n.getTipo(),n.getTitulo(),n.getConteudo(),n.getCriadaEm(),n.getLidaEm(),n.getCanal(),n.getStatusEntrega());}}
}
