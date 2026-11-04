package com.taskgo.api;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/api/auth/recuperacao")
public class RecuperacaoSenhaController {
    private final RecuperacaoSenhaService service;
    public RecuperacaoSenhaController(RecuperacaoSenhaService service){this.service=service;}
    @PostMapping @ResponseStatus(HttpStatus.ACCEPTED)
    public MensagemResponse solicitar(@RequestBody RecuperacaoSenhaService.SolicitarRequest request,HttpServletRequest http){
        service.solicitar(request==null?null:request.email(),http.getRemoteAddr());
        return new MensagemResponse("Se a conta existir e o envio de e-mail estiver configurado, você receberá instruções para redefinir a senha.");
    }
    @PostMapping("/redefinir") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void redefinir(@RequestBody RecuperacaoSenhaService.RedefinirRequest request){
        service.redefinir(request==null?null:request.token(),request==null?null:request.novaSenha(),request==null?null:request.confirmarSenha());
    }
    public record MensagemResponse(String message){}
}
