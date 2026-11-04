package com.taskgo.api;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/api/notificacoes")
public class NotificacaoController {
    private final NotificacaoService service;
    public NotificacaoController(NotificacaoService service){this.service=service;}
    @GetMapping public List<NotificacaoService.NotificacaoDto> listar(Authentication auth){return service.listar(principal(auth).id()).stream().map(NotificacaoService.NotificacaoDto::from).toList();}
    @GetMapping("/nao-lidas") public CountDto naoLidas(Authentication auth){return new CountDto(service.naoLidas(principal(auth).id()));}
    @PatchMapping("/{id}/lida") public NotificacaoService.NotificacaoDto marcarLida(@PathVariable String id,Authentication auth){return NotificacaoService.NotificacaoDto.from(service.marcarLida(principal(auth).id(),id));}
    @PatchMapping("/lidas") @ResponseStatus(HttpStatus.NO_CONTENT) public void marcarTodas(Authentication auth){service.marcarTodas(principal(auth).id());}
    private TaskgoPrincipal principal(Authentication auth){if(auth==null||!(auth.getPrincipal() instanceof TaskgoPrincipal p))throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED);return p;}
    public record CountDto(long count){}
}
