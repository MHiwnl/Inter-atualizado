package com.taskgo.api;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FinanceiroService {
    private final CarteiraRepository carteiras;
    private final TransacaoFinanceiraRepository transacoes;
    private final SolicitacaoSaqueRepository saques;

    public FinanceiroService(CarteiraRepository carteiras, TransacaoFinanceiraRepository transacoes, SolicitacaoSaqueRepository saques) {
        this.carteiras=carteiras; this.transacoes=transacoes; this.saques=saques;
    }

    @Transactional
    public CarteiraDto consultarCarteira(Long usuarioId) {
        Carteira carteira=carteiras.findByUsuarioId(usuarioId).orElseGet(() -> carteiras.save(new Carteira(usuarioId)));
        return CarteiraDto.from(carteira);
    }

    @Transactional(readOnly=true)
    public Page<TransacaoDto> listarTransacoes(Long usuarioId, Pageable pageable) {
        return transacoes.findByUsuarioIdOrderByCriadaEmDesc(usuarioId,pageable).map(TransacaoDto::from);
    }

    @Transactional
    public SaqueDto solicitarSaque(Long usuarioId, String tipoConta, String chaveIdempotencia, BigDecimal valor) {
        if (!"profissional".equalsIgnoreCase(tipoConta)) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Somente profissionais podem solicitar saque.");
        if (chaveIdempotencia==null || chaveIdempotencia.isBlank() || chaveIdempotencia.length()>100)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Informe uma chave de idempotência válida.");
        BigDecimal quantia=validarValor(valor);
        var anterior=saques.findByUsuarioIdAndChaveIdempotencia(usuarioId,chaveIdempotencia);
        if(anterior.isPresent()) {
            if(anterior.get().getValor().compareTo(quantia)!=0) throw new ResponseStatusException(HttpStatus.CONFLICT,"A chave de idempotência já foi usada com outro valor.");
            return SaqueDto.from(anterior.get());
        }

        Carteira carteira=carteiras.findByUsuarioIdForUpdate(usuarioId).orElseGet(() -> carteiras.save(new Carteira(usuarioId)));
        // Recheck while holding the wallet lock so concurrent retries remain idempotent.
        anterior=saques.findByUsuarioIdAndChaveIdempotencia(usuarioId,chaveIdempotencia);
        if(anterior.isPresent()) {
            if(anterior.get().getValor().compareTo(quantia)!=0) throw new ResponseStatusException(HttpStatus.CONFLICT,"A chave de idempotência já foi usada com outro valor.");
            return SaqueDto.from(anterior.get());
        }
        if(carteira.getSaldoDisponivel().compareTo(quantia)<0) throw new ResponseStatusException(HttpStatus.CONFLICT,"Saldo disponível insuficiente.");
        carteira.reservar(quantia);
        long agora=Instant.now().toEpochMilli();
        String saqueId=UUID.randomUUID().toString();
        SolicitacaoSaque saque=saques.save(new SolicitacaoSaque(saqueId,usuarioId,quantia,chaveIdempotencia,agora));
        transacoes.save(new TransacaoFinanceira(UUID.randomUUID().toString(),usuarioId,"SAQUE_RESERVADO",quantia,"PENDENTE",saqueId,agora));
        // SOLICITADO indica registro e reserva internos; somente integração de payout confirmará conclusão.
        return SaqueDto.from(saque);
    }

    @Transactional(readOnly=true)
    public java.util.List<SaqueDto> listarSaques(Long usuarioId) {
        return saques.findByUsuarioIdOrderByCriadaEmDesc(usuarioId).stream().map(SaqueDto::from).toList();
    }

    private BigDecimal validarValor(BigDecimal valor) {
        if(valor==null || valor.signum()<=0 || valor.scale()>2 || valor.precision()>17)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Informe um valor positivo com até duas casas decimais.");
        return valor.setScale(2,RoundingMode.UNNECESSARY);
    }

    public record CarteiraDto(BigDecimal disponivel,BigDecimal pendente,BigDecimal bloqueado,String moeda) {
        static CarteiraDto from(Carteira c){return new CarteiraDto(c.getSaldoDisponivel(),c.getSaldoPendente(),c.getSaldoBloqueado(),"BRL");}
    }
    public record TransacaoDto(String id,String tipo,BigDecimal valor,String moeda,String status,String referencia,long criadaEm) {
        static TransacaoDto from(TransacaoFinanceira t){return new TransacaoDto(t.getId(),t.getTipo(),t.getValor(),t.getMoeda(),t.getStatus(),t.getReferencia(),t.getCriadaEm());}
    }
    public record SaqueDto(String id,BigDecimal valor,String moeda,String status,long criadaEm) {
        static SaqueDto from(SolicitacaoSaque s){return new SaqueDto(s.getId(),s.getValor(),s.getMoeda(),s.getStatus(),s.getCriadaEm());}
    }
}
