package com.taskgo.api;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    private String id;
    private String code;
    private Long created;
    private String status;
    private Double price;
    private String service;
    private String proId;
    private String proEmail;
    private String professionalName;
    private String clientId;
    private String clientEmail;
    @Column(columnDefinition = "text")
    private String address;
    private Double rating;
    @Column(columnDefinition = "text")
    private String notes;
    private String paid;
    private Double dist;
    private Integer eta;
    private Double progress;
    private Long sched;
    private String cancelReason;
    private Long acceptedAt;
    private Long completedAt;
    @Convert(converter = JsonMapConverter.class)
    @Column(columnDefinition = "text")
    private Map<String, Object> extra = new HashMap<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Long getCreated() { return created; }
    public void setCreated(Long created) { this.created = created; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getProId() { return proId; }
    public void setProId(String proId) { this.proId = proId; }
    public String getProEmail() { return proEmail; }
    public void setProEmail(String proEmail) { this.proEmail = proEmail; }
    public String getProfessionalName() { return professionalName; }
    public void setProfessionalName(String professionalName) { this.professionalName = professionalName; }
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getPaid() { return paid; }
    public void setPaid(String paid) { this.paid = paid; }
    public Double getDist() { return dist; }
    public void setDist(Double dist) { this.dist = dist; }
    public Integer getEta() { return eta; }
    public void setEta(Integer eta) { this.eta = eta; }
    public Double getProgress() { return progress; }
    public void setProgress(Double progress) { this.progress = progress; }
    public Long getSched() { return sched; }
    public void setSched(Long sched) { this.sched = sched; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public Long getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(Long acceptedAt) { this.acceptedAt = acceptedAt; }
    public Long getCompletedAt() { return completedAt; }
    public void setCompletedAt(Long completedAt) { this.completedAt = completedAt; }
    @JsonAnySetter public void addExtra(String key, Object value) { extra.put(key, value); }
    @JsonAnyGetter public Map<String, Object> getExtra() { return extra; }
}
