package com.taskgo.api;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/api/contatos")
public class ContatoController {
    private final ContatoService service;
    public ContatoController(ContatoService service){this.service=service;}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public ContatoService.ContatoResponse enviar(@RequestBody ContatoService.ContatoRequest request,HttpServletRequest http){return service.receber(request,http.getRemoteAddr());}
}
