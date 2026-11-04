package com.taskgo.api;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/pedidos/contratados/{pedidoId}/mensagens")
public class MensagemController {
    private final PedidoContratadoRepository pedidos;
    private final MensagemRepository mensagens;
    private final UsuarioRepository usuarios;
    private final NotificacaoService notificacoes;

    public MensagemController(PedidoContratadoRepository pedidos, MensagemRepository mensagens, UsuarioRepository usuarios, NotificacaoService notificacoes) {
        this.pedidos=pedidos; this.mensagens=mensagens; this.usuarios=usuarios; this.notificacoes=notificacoes;
    }

    @GetMapping
    @Transactional
    public List<MensagemDto> listar(@PathVariable String pedidoId, Authentication auth) {
        TaskgoPrincipal user=principal(auth); validarParticipante(pedidoId,user);
        List<Mensagem> historico=mensagens.findByPedidoIdOrderByCriadaEmAsc(pedidoId);
        long agora=System.currentTimeMillis();
        List<Mensagem> novasLidas=historico.stream().filter(m->user.id().equals(m.getDestinatarioId())&&m.getLidaEm()==null).toList();
        novasLidas.forEach(m->m.marcarLida(agora));
        if(!novasLidas.isEmpty())mensagens.saveAll(novasLidas);
        return historico.stream().map(MensagemDto::from).toList();
    }

    @PostMapping
    @Transactional
    public MensagemDto enviar(@PathVariable String pedidoId, @RequestBody NovaMensagem body, Authentication auth) {
        TaskgoPrincipal user=principal(auth); Pedido pedido=validarParticipante(pedidoId,user);
        if ("aguardando".equalsIgnoreCase(pedido.getStatus()) || "cancelado".equalsIgnoreCase(pedido.getStatus()))
            throw new ResponseStatusException(HttpStatus.CONFLICT,"A conversa só está disponível após o aceite.");
        if (body==null || body.clientMessageId()==null || body.clientMessageId().isBlank() || body.clientMessageId().length()>80
                || body.texto()==null || body.texto().isBlank() || body.texto().length()>2000)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Mensagem ou identificador inválido.");
        Mensagem existing=mensagens.findByAutorIdAndClientMessageId(user.id(),body.clientMessageId()).orElse(null);
        if(existing!=null){if(!existing.getPedidoId().equals(pedidoId))throw new ResponseStatusException(HttpStatus.CONFLICT);return MensagemDto.from(existing);}
        String emailDestino=user.email().equalsIgnoreCase(pedido.getClientEmail())?pedido.getProEmail():pedido.getClientEmail();
        Usuario destinatario=usuarios.findByEmailIgnoreCase(emailDestino==null?"":emailDestino).orElseThrow(()->new ResponseStatusException(HttpStatus.CONFLICT,"Destinatario da conversa indisponivel."));
        long agora=System.currentTimeMillis();
        Mensagem saved=mensagens.save(new Mensagem(java.util.UUID.randomUUID().toString(),pedidoId,user.id(),destinatario.getId(),body.clientMessageId(),body.texto().trim(),agora));
        notificacoes.criar(destinatario.getId(),pedidoId,"mensagem","Nova mensagem","Voce recebeu uma nova mensagem sobre um pedido.","mensagem:"+saved.getId());
        return MensagemDto.from(saved);
    }

    private Pedido validarParticipante(String id,TaskgoPrincipal user){
        Pedido p=pedidos.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        boolean related=user.email().equalsIgnoreCase(p.getClientEmail()==null?"":p.getClientEmail())
                || user.email().equalsIgnoreCase(p.getProEmail()==null?"":p.getProEmail());
        if(!related)throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        return p;
    }
    private TaskgoPrincipal principal(Authentication a){if(a==null||!(a.getPrincipal() instanceof TaskgoPrincipal p))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);return p;}
    public record NovaMensagem(String clientMessageId,String texto){}
    public record MensagemDto(String id,String pedidoId,Long autorId,Long destinatarioId,String texto,long criadaEm,Long lidaEm,boolean automatica){static MensagemDto from(Mensagem m){return new MensagemDto(m.getId(),m.getPedidoId(),m.getAutorId(),m.getDestinatarioId(),m.getTexto(),m.getCriadaEm(),m.getLidaEm(),m.isAutomatica());}}
}
