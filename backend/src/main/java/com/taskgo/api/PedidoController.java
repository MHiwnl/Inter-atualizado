package com.taskgo.api;

import java.util.List;
import java.util.Locale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository repository;

    public PedidoController(PedidoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<ApiPage<PedidoEstimativaDto>> listar(Authentication auth,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String servico, @RequestParam(defaultValue = "id,desc") String sort) {
        TaskgoPrincipal p = principal(auth);
        if (!"cliente".equalsIgnoreCase(p.tipo())) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);
        Pageable pageable = pageable(page, size, sort, List.of("id", "servico"));
        Page<PedidoEstimativa> result = servico == null || servico.isBlank()
                ? repository.findByEmailClienteIgnoreCase(p.email(), pageable)
                : repository.findByEmailClienteIgnoreCaseAndServicoIgnoreCase(p.email(), servico.trim(), pageable);
        return ResponseEntity.ok(ApiPage.from(result.map(PedidoEstimativaDto::from)));
    }

    @PostMapping("/estimar")
    public PedidoEstimativa estimar(@RequestBody PedidoEstimativa pedido, Authentication auth) {
        pedido.setId(null);
        pedido.setEmailCliente(auth != null && auth.getPrincipal() instanceof TaskgoPrincipal p && "cliente".equalsIgnoreCase(p.tipo()) ? p.email() : null);
        return repository.save(pedido);
    }

    private TaskgoPrincipal principal(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof TaskgoPrincipal p)) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
        return p;
    }

    static Pageable pageable(int page, int size, String sort, List<String> allowedFields) {
        if (page < 0 || size < 1 || size > 100) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Parâmetros de paginação inválidos.");
        String[] parts = sort == null ? new String[0] : sort.split(",", -1);
        if (parts.length != 2 || !allowedFields.contains(parts[0]) || !(parts[1].equalsIgnoreCase("asc") || parts[1].equalsIgnoreCase("desc")))
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Ordenação não permitida.");
        return PageRequest.of(page, size, Sort.by(Sort.Direction.valueOf(parts[1].toUpperCase(Locale.ROOT)), parts[0]));
    }
}
