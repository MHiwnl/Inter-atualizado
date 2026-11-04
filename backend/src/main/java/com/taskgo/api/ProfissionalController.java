package com.taskgo.api;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {
    private final UsuarioRepository usuarios;
    private final PedidoContratadoRepository pedidos;

    public ProfissionalController(UsuarioRepository usuarios, PedidoContratadoRepository pedidos) { this.usuarios = usuarios; this.pedidos = pedidos; }

    @GetMapping
    public List<ProfissionalPublicoDto> listar(@RequestParam(required = false) String servico) {
        List<Usuario> profissionais = servico == null || servico.isBlank()
                ? usuarios.findByTipoIgnoreCaseOrderByNomeAsc("profissional")
                : usuarios.findByTipoIgnoreCaseAndServiceIgnoreCaseOrderByNomeAsc("profissional", servico.trim());
        return profissionais.stream().filter(p -> p.getProId() != null && !p.getProId().isBlank())
                .map(p -> { Object[] summary = pedidos.resumoAvaliacoes(p.getEmail());
                    Double rating = summary[0] instanceof Number n ? n.doubleValue() : null;
                    long reviews = summary[1] instanceof Number n ? n.longValue() : 0L;
                    return ProfissionalPublicoDto.from(p, rating, reviews); }).toList();
    }
}
