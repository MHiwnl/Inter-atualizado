package com.taskgo.api;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/financeiro")
public class FinanceiroController {
    private final FinanceiroService service;
    public FinanceiroController(FinanceiroService service){this.service=service;}

    @GetMapping("/carteira")
    public FinanceiroService.CarteiraDto carteira(Authentication auth){return service.consultarCarteira(principal(auth).id());}

    @GetMapping("/transacoes")
    public Page<FinanceiroService.TransacaoDto> transacoes(Authentication auth,
            @RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){
        if(page<0||size<1||size>100)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Paginação inválida.");
        return service.listarTransacoes(principal(auth).id(),PageRequest.of(page,size));
    }

    @GetMapping("/saques")
    public List<FinanceiroService.SaqueDto> saques(Authentication auth){return service.listarSaques(principal(auth).id());}

    @PostMapping("/saques") @ResponseStatus(HttpStatus.CREATED)
    public FinanceiroService.SaqueDto solicitarSaque(Authentication auth,@RequestHeader(value="Idempotency-Key",required=false) String idempotencyKey,@RequestBody SaqueRequest request){
        TaskgoPrincipal p=principal(auth);
        return service.solicitarSaque(p.id(),p.tipo(),idempotencyKey,request==null?null:request.valor());
    }
    private TaskgoPrincipal principal(Authentication a){if(a==null||!(a.getPrincipal() instanceof TaskgoPrincipal p))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);return p;}
    public record SaqueRequest(BigDecimal valor){}
}
