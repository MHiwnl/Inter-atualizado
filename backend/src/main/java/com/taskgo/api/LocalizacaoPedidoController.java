package com.taskgo.api;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos/contratados/{pedidoId}/localizacao")
public class LocalizacaoPedidoController {
    private final LocalizacaoPedidoService service;
    public LocalizacaoPedidoController(LocalizacaoPedidoService service){this.service=service;}
    @GetMapping public ResponseEntity<LocalizacaoPedidoService.LocalizacaoDto> obter(@PathVariable String pedidoId, Authentication auth){
        Optional<LocalizacaoPedidoService.LocalizacaoDto> local=service.obter(pedidoId,principal(auth));
        return local.map(ResponseEntity::ok).orElseGet(()->ResponseEntity.noContent().build());
    }
    @PostMapping public LocalizacaoPedidoService.LocalizacaoDto registrar(@PathVariable String pedidoId,@RequestBody LocalizacaoPedidoService.LocalizacaoRequest body,Authentication auth){return service.registrar(pedidoId,principal(auth),body);}
    @DeleteMapping @org.springframework.web.bind.annotation.ResponseStatus(HttpStatus.NO_CONTENT) public void encerrar(@PathVariable String pedidoId,Authentication auth){service.encerrar(pedidoId,principal(auth));}
    private TaskgoPrincipal principal(Authentication auth){if(auth==null||!(auth.getPrincipal() instanceof TaskgoPrincipal p))throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED);return p;}
}
