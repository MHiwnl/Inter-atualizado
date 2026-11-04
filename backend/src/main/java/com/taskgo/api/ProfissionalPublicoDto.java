package com.taskgo.api;

public record ProfissionalPublicoDto(String id, String name, String service, String city, String bio, Double rating, long reviews) {
    static ProfissionalPublicoDto from(Usuario u, Double rating, long reviews) {
        return new ProfissionalPublicoDto(u.getProId(), u.getNome(), u.getService(), u.getCidade(), u.getBio(), rating, reviews);
    }
}
