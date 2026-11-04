package com.taskgo.api;

public record OportunidadePedidoDto(String id, String service, String notes, Long created,
                                    String status, Double price, Long sched) {
    public static OportunidadePedidoDto from(Pedido pedido) {
        String notes = pedido.getNotes();
        if (notes != null) {
            notes = notes.replaceAll("(?i)[\\w.+-]+@[\\w.-]+\\.[a-z]{2,}", "[contato removido]")
                    .replaceAll("(?<!\\d)(?:\\+?55\\s*)?(?:\\(?\\d{2}\\)?\\s*)?9?\\d{4}[- .]?\\d{4}(?!\\d)", "[telefone removido]");
        }
        return new OportunidadePedidoDto(pedido.getId(), pedido.getService(), notes,
                pedido.getCreated(), pedido.getStatus(), pedido.getPrice(), pedido.getSched());
    }
}
