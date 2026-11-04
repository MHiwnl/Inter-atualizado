package com.taskgo.api;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** Keeps only the latest position while a contracted order is en route. */
@Entity
@Table(name = "pedido_localizacoes")
public class LocalizacaoPedido {
    @Id private String pedidoId;
    private double latitude;
    private double longitude;
    private double accuracy;
    private long measuredAt;
    private long receivedAt;

    protected LocalizacaoPedido() {}
    public LocalizacaoPedido(String pedidoId, double latitude, double longitude, double accuracy, long measuredAt, long receivedAt) {
        this.pedidoId=pedidoId; this.latitude=latitude; this.longitude=longitude; this.accuracy=accuracy; this.measuredAt=measuredAt; this.receivedAt=receivedAt;
    }
    public String getPedidoId(){return pedidoId;} public double getLatitude(){return latitude;} public double getLongitude(){return longitude;}
    public double getAccuracy(){return accuracy;} public long getMeasuredAt(){return measuredAt;} public long getReceivedAt(){return receivedAt;}
}
