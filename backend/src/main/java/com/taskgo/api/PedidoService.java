package com.taskgo.api;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class PedidoService {
    private final PedidoContratadoRepository repository;
    private final UsuarioRepository usuarios;
    public PedidoService(PedidoContratadoRepository repository) { this(repository, null); }
    @Autowired
    public PedidoService(PedidoContratadoRepository repository, UsuarioRepository usuarios) { this.repository = repository; this.usuarios = usuarios; }

    @Transactional
    public Pedido criar(Pedido pedido) {
        if (pedido.getId() == null || pedido.getId().isBlank() || pedido.getClientEmail() == null || pedido.getClientEmail().isBlank()
                || pedido.getService() == null || pedido.getService().isBlank() || pedido.getPrice() == null || pedido.getPrice() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pedido incompleto: informe id, cliente, serviÃ§o e valor.");
        }
        if (repository.existsById(pedido.getId())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Pedido jÃ¡ cadastrado.");
        Map<String,Object> extrasSeguros=sanitizarExtras(pedido.getExtra());
        pedido.getExtra().clear();pedido.getExtra().putAll(extrasSeguros);
        pedido.setStatus("aguardando");
        pedido.setCreated(System.currentTimeMillis());
        pedido.setAcceptedAt(null); pedido.setCompletedAt(null); pedido.setPaid(null);
        if (pedido.getProgress() == null) pedido.setProgress(0.0);
        return repository.save(pedido);
    }

    @Transactional(readOnly = true)
    public List<Pedido> listarDoUsuario(String email) {
        if (email == null || email.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o e-mail da conta.");
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        return repository.findByClientEmailIgnoreCaseOrProEmailIgnoreCaseOrderByCreatedDesc(normalized, normalized);
    }

    @Transactional(readOnly = true)
    public Page<Pedido> listarDisponiveis(String email, String service, Pageable pageable) {
        return service == null || service.isBlank()
                ? repository.encontrarDisponiveis("aguardando", pageable)
                : repository.encontrarDisponiveisPorServico("aguardando", service.trim(), pageable);
    }

    @Transactional(readOnly = true)
    public java.util.Optional<Pedido> encontrarDisponivel(String id) {
        return repository.findByIdAndStatusIgnoreCaseAndProEmailIsNull(id, "aguardando");
    }

    @Transactional
    public Pedido avaliar(String id, String email, Double rating, String comment) {
        if (rating == null || rating < 1 || rating > 5 || rating % 1 != 0 || comment != null && comment.length() > 2000)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe uma nota inteira de 1 a 5 e um comentário de até 2000 caracteres.");
        Pedido pedido=repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Pedido não encontrado."));
        String author=email.trim().toLowerCase(Locale.ROOT);
        boolean client=equalsEmail(author,pedido.getClientEmail()), professional=equalsEmail(author,pedido.getProEmail());
        if (!client&&!professional) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Somente participantes deste pedido podem avaliá-lo.");
        if (!"concluido".equalsIgnoreCase(pedido.getStatus())) throw new ResponseStatusException(HttpStatus.CONFLICT,"O pedido precisa estar concluído.");
        if(client){
            if(pedido.getRating()!=null)throw new ResponseStatusException(HttpStatus.CONFLICT,"Este pedido já foi avaliado por este cliente.");
            pedido.setRating(rating);pedido.getExtra().put("comment",comment==null?"":comment.trim());
        }else{
            if(pedido.getExtra().get("clientRating")!=null)throw new ResponseStatusException(HttpStatus.CONFLICT,"Este pedido já foi avaliado por este profissional.");
            pedido.getExtra().put("clientRating",rating);pedido.getExtra().put("clientComment",comment==null?"":comment.trim());
        }
        return repository.save(pedido);
    }

    @Transactional
    public Pedido aceitar(String id, String email) {
        if (email == null || email.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a conta profissional.");
        if (usuarios == null) throw new IllegalStateException("RepositÃ³rio de usuÃ¡rios nÃ£o configurado.");
        Usuario profissional = usuarios.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Conta profissional nÃ£o encontrada."));
        if (!"profissional".equalsIgnoreCase(profissional.getTipo()) || profissional.getProId() == null || profissional.getProId().isBlank())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente uma conta profissional vÃ¡lida pode aceitar pedidos.");
        int atualizados = repository.aceitarSeDisponivel(id, profissional.getEmail().trim().toLowerCase(Locale.ROOT),
                profissional.getProId(), profissional.getNome(), System.currentTimeMillis());
        if (atualizados == 0) {
            if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido nÃ£o encontrado.");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este pedido nÃ£o estÃ¡ mais disponÃ­vel.");
        }
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido nÃ£o encontrado."));
    }

    @Transactional
    public Pedido atualizar(String id, String email, Pedido atualizacao) {
        if (email == null || email.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o e-mail da conta.");
        Pedido pedido = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado."));
        String usuario = email.trim().toLowerCase(Locale.ROOT);
        boolean cliente = equalsEmail(usuario, pedido.getClientEmail());
        boolean profissional = equalsEmail(usuario, pedido.getProEmail());
        if (!cliente && !profissional) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este pedido não pertence a esta conta.");
        String novoStatus = atualizacao.getStatus();
        if (cliente && novoStatus != null && !"cancelado".equals(novoStatus) && !novoStatus.equals(pedido.getStatus()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O cliente só pode cancelar o próprio pedido.");
        if (novoStatus != null && !novoStatus.equals(pedido.getStatus()) && !transicaoPermitida(pedido.getStatus(), novoStatus))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Transição de status inválida.");
        if (novoStatus != null) pedido.setStatus(novoStatus);
        if ("a_caminho".equals(novoStatus) && pedido.getAcceptedAt() == null) pedido.setAcceptedAt(System.currentTimeMillis());
        if (atualizacao.getProgress() != null && profissional) pedido.setProgress(atualizacao.getProgress());
        if (atualizacao.getPaid() != null && cliente) pedido.setPaid(atualizacao.getPaid());
        if (atualizacao.getRating() != null && cliente && "concluido".equals(pedido.getStatus())) pedido.setRating(atualizacao.getRating());
        if (atualizacao.getCancelReason() != null && "cancelado".equals(pedido.getStatus())) pedido.setCancelReason(atualizacao.getCancelReason());
        if ("concluido".equals(novoStatus) && pedido.getCompletedAt() == null) pedido.setCompletedAt(System.currentTimeMillis());
        return repository.save(pedido);
    }

    private boolean equalsEmail(String a, String b) { return b != null && a.equals(b.trim().toLowerCase(Locale.ROOT)); }
    private Map<String, Object> sanitizarExtras(Map<String, ?> dados) {
        Map<String, Object> safe = new LinkedHashMap<>(); if (dados == null) return safe;
        Set<String> bloqueadas = Set.of("pass", "password", "senha", "passwordhash", "token", "accesstoken", "refreshtoken");
        dados.forEach((key, value) -> {
            String normalized=key.toLowerCase(Locale.ROOT).replaceAll("[^a-z]", "");
            if (bloqueadas.contains(normalized)) return;
            if (value instanceof Map<?, ?> map) { Map<String,Object> nested=new LinkedHashMap<>();map.forEach((k,v)->nested.put(String.valueOf(k),v));safe.put(key,sanitizarExtras(nested)); }
            else if (value instanceof List<?> list) { List<Object> nested=new ArrayList<>();for(Object item:list){if(item instanceof Map<?,?> map){Map<String,Object> child=new LinkedHashMap<>();map.forEach((k,v)->child.put(String.valueOf(k),v));nested.add(sanitizarExtras(child));}else nested.add(item);}safe.put(key,nested); }
            else safe.put(key,value);
        });
        return safe;
    }
    private boolean transicaoPermitida(String atual, String novo) {
        if ("cancelado".equals(novo)) return !"concluido".equals(atual) && !"cancelado".equals(atual);
        return switch (atual == null ? "" : atual) {
            case "aguardando" -> "a_caminho".equals(novo);
            case "a_caminho" -> "chegou".equals(novo);
            case "chegou" -> "em_andamento".equals(novo);
            case "em_andamento" -> "concluido".equals(novo);
            default -> false;
        };
    }
}

