package com.taskgo.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

@DataJpaTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:taskgo-test;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false"
})
class UsuarioRepositoryIntegrationTest {

    @Autowired
    private UsuarioRepository usuarios;

    @Test
    void persisteEConsultaUsuarioSemDependerDeDadosManuais() {
        Usuario usuario = new Usuario();
        usuario.setNome("Ana Teste");
        usuario.setEmail("ana.teste@example.com");
        usuario.setTipo("cliente");
        usuario.setCredentialVersion(0);

        Usuario salvo = usuarios.saveAndFlush(usuario);
        Long id = salvo.getId();
        usuarios.flush();

        assertThat(id).isNotNull();
        assertThat(usuarios.findByEmailIgnoreCase("ANA.TESTE@example.com"))
                .get()
                .extracting(Usuario::getId, Usuario::getNome, Usuario::getTipo)
                .containsExactly(id, "Ana Teste", "cliente");
    }

    @Test
    void rejeitaEmailDuplicadoNoBanco() {
        Usuario primeiro = new Usuario();
        primeiro.setNome("Ana");
        primeiro.setEmail("unico@example.com");
        primeiro.setTipo("cliente");
        usuarios.saveAndFlush(primeiro);

        Usuario duplicado = new Usuario();
        duplicado.setNome("Outra Ana");
        duplicado.setEmail("unico@example.com");
        duplicado.setTipo("profissional");

        assertThatThrownBy(() -> usuarios.saveAndFlush(duplicado))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
