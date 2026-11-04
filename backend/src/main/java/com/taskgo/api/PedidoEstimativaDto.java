package com.taskgo.api;

public record PedidoEstimativaDto(Long id, String servico, String distancia) {
    public static PedidoEstimativaDto from(PedidoEstimativa pedido) {
        return new PedidoEstimativaDto(pedido.getId(), pedido.getServico(), pedido.getDistancia());
    }
}
