package com.taskgo.api;

import java.time.Clock;
import java.util.Locale;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LocalizacaoPedidoService {
    private static final long MAX_AGE_MS=120_000, FUTURE_TOLERANCE_MS=30_000, MIN_INTERVAL_MS=10_000;
    private final PedidoContratadoRepository pedidos;
    private final LocalizacaoPedidoRepository localizacoes;
    private final Clock clock;

    @org.springframework.beans.factory.annotation.Autowired
    public LocalizacaoPedidoService(PedidoContratadoRepository pedidos, LocalizacaoPedidoRepository localizacoes) {
        this(pedidos, localizacoes, Clock.systemUTC());
    }
    LocalizacaoPedidoService(PedidoContratadoRepository pedidos, LocalizacaoPedidoRepository localizacoes, Clock clock) {
        this.pedidos=pedidos; this.localizacoes=localizacoes; this.clock=clock;
    }

    @Transactional
    public LocalizacaoDto registrar(String pedidoId, TaskgoPrincipal principal, LocalizacaoRequest request) {
        Pedido pedido=pedido(pedidoId);
        if (!"profissional".equalsIgnoreCase(principal.tipo()) || !igual(principal.email(),pedido.getProEmail()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Somente o profissional deste pedido pode compartilhar a localização.");
        exigirEmRota(pedido);
        if (request==null || !Double.isFinite(request.latitude()) || request.latitude() < -90 || request.latitude() > 90
                || !Double.isFinite(request.longitude()) || request.longitude() < -180 || request.longitude() > 180
                || !Double.isFinite(request.accuracy()) || request.accuracy() <= 0 || request.accuracy() > 10_000)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Coordenadas ou precisão inválidas.");
        long now=clock.millis(), measured=request.measuredAt();
        if (measured <= 0 || measured < now-MAX_AGE_MS || measured > now+FUTURE_TOLERANCE_MS)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"A medição de localização está desatualizada ou tem horário inválido.");
        Optional<LocalizacaoPedido> previous=localizacoes.findById(pedidoId);
        if(previous.isPresent() && (measured <= previous.get().getMeasuredAt() || now-previous.get().getReceivedAt() < MIN_INTERVAL_MS))
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,"Aguarde antes de enviar outra posição.");
        return LocalizacaoDto.from(localizacoes.save(new LocalizacaoPedido(pedidoId,request.latitude(),request.longitude(),request.accuracy(),measured,now)));
    }

    @Transactional(readOnly=true)
    public Optional<LocalizacaoDto> obter(String pedidoId, TaskgoPrincipal principal) {
        Pedido pedido=pedido(pedidoId);
        if(!igual(principal.email(),pedido.getProEmail()) && !igual(principal.email(),pedido.getClientEmail()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Este pedido não pertence a esta conta.");
        exigirEmRota(pedido);
        return localizacoes.findById(pedidoId).map(LocalizacaoDto::from);
    }

    @Transactional
    public void encerrar(String pedidoId, TaskgoPrincipal principal) {
        Pedido pedido=pedido(pedidoId);
        if(!"profissional".equalsIgnoreCase(principal.tipo()) || !igual(principal.email(),pedido.getProEmail()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Somente o profissional deste pedido pode encerrar o compartilhamento.");
        localizacoes.deleteById(pedidoId);
    }

    @Transactional
    public void limparSeEncerrado(Pedido pedido) {
        if(pedido!=null && !"a_caminho".equalsIgnoreCase(pedido.getStatus())) localizacoes.deleteById(pedido.getId());
    }

    private Pedido pedido(String id){return pedidos.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Pedido não encontrado."));}
    private void exigirEmRota(Pedido pedido){if(!"a_caminho".equalsIgnoreCase(pedido.getStatus())) throw new ResponseStatusException(HttpStatus.CONFLICT,"O rastreamento está disponível somente enquanto o pedido está a caminho.");}
    private boolean igual(String a,String b){return a!=null&&b!=null&&a.trim().toLowerCase(Locale.ROOT).equals(b.trim().toLowerCase(Locale.ROOT));}

    public record LocalizacaoRequest(double latitude,double longitude,double accuracy,long measuredAt) {}
    public record LocalizacaoDto(String pedidoId,double latitude,double longitude,double accuracy,long measuredAt,long receivedAt) {
        static LocalizacaoDto from(LocalizacaoPedido p){return new LocalizacaoDto(p.getPedidoId(),p.getLatitude(),p.getLongitude(),p.getAccuracy(),p.getMeasuredAt(),p.getReceivedAt());}
    }
}
