package com.taskgo.api;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos/contratados")
public class PedidoContratadoController {
    private final PedidoService service;
    private final UsuarioRepository usuarios;
    private final LocalizacaoPedidoService localizacoes;
    public PedidoContratadoController(PedidoService service, UsuarioRepository usuarios, LocalizacaoPedidoService localizacoes) { this.service = service; this.usuarios = usuarios; this.localizacoes=localizacoes; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido criar(@RequestBody Pedido pedido, Authentication auth) {
        TaskgoPrincipal p = principal(auth);
        exigirTipo(p, "cliente");
        pedido.setClientEmail(p.email()); pedido.setClientId(String.valueOf(p.id()));
        if (pedido.getProEmail() != null && !pedido.getProEmail().isBlank()) {
            Usuario pro = usuarios.findByEmailIgnoreCase(pedido.getProEmail().trim())
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Profissional selecionado não encontrado."));
            if (!"profissional".equalsIgnoreCase(pro.getTipo()) || pro.getProId() == null || pro.getProId().isBlank()
                    || pedido.getProId() != null && !pedido.getProId().equals(pro.getProId()))
                throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Profissional selecionado inválido.");
            pedido.setProEmail(pro.getEmail()); pedido.setProId(pro.getProId()); pedido.setProfessionalName(pro.getNome());
        }
        return service.criar(pedido);
    }

    @GetMapping
    public List<Pedido> listar(Authentication auth) { return service.listarDoUsuario(principal(auth).email()); }

    @GetMapping("/disponiveis")
    public ApiPage<OportunidadePedidoDto> disponiveis(@RequestParam(required = false) String servico,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "created,desc") String sort, Authentication auth) {
        TaskgoPrincipal p = principal(auth); exigirTipo(p, "profissional");
        Pageable pageable = PedidoController.pageable(page, size, sort, List.of("created", "price"));
        Page<Pedido> result = service.listarDisponiveis(p.email(), servico, pageable);
        return ApiPage.from(result.map(OportunidadePedidoDto::from));
    }

    @GetMapping("/{id}")
    public Object obter(@PathVariable String id, Authentication auth) {
        TaskgoPrincipal principal = principal(auth);
        Pedido relacionado = service.listarDoUsuario(principal.email()).stream()
                .filter(p -> p.getId().equals(id)).findFirst().orElse(null);
        if (relacionado != null) return relacionado;
        exigirTipo(principal, "profissional");
        return service.encontrarDisponivel(id).<Object>map(OportunidadePedidoDto::from)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public Pedido atualizar(@PathVariable String id, @RequestBody Pedido pedido, Authentication auth) {
        Pedido atualizado=service.atualizar(id, principal(auth).email(), pedido);
        localizacoes.limparSeEncerrado(atualizado);
        return atualizado;
    }

    @PostMapping("/{id}/aceitar")
    public Pedido aceitar(@PathVariable String id, Authentication auth) {
        TaskgoPrincipal p = principal(auth); exigirTipo(p, "profissional");
        return service.aceitar(id, p.email());
    }

    @PostMapping("/{id}/avaliacoes")
    public Pedido avaliar(@PathVariable String id, @RequestBody AvaliacaoRequest request, Authentication auth) {
        TaskgoPrincipal p=principal(auth);
        if(!"cliente".equalsIgnoreCase(p.tipo())&& !"profissional".equalsIgnoreCase(p.tipo())) throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN);
        return service.avaliar(id,p.email(),request==null?null:request.rating(),request==null?null:request.comment());
    }

    private TaskgoPrincipal principal(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof TaskgoPrincipal p)) throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return p;
    }
    private void exigirTipo(TaskgoPrincipal p, String tipo) {
        if (!tipo.equalsIgnoreCase(p.tipo())) throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Operação não permitida para este tipo de conta.");
    }
    public record AvaliacaoRequest(Double rating,String comment) {}
}
