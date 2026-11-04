package com.taskgo.api;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository repository;
    private final PedidoRepository pedidoRepository;
    private final PedidoContratadoRepository pedidoContratadoRepository;
    private final MensagemRepository mensagemRepository;
    private final NotificacaoRepository notificacaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptLimiter loginAttemptLimiter;

    public AuthController(UsuarioRepository repository, PedidoRepository pedidoRepository,
            PedidoContratadoRepository pedidoContratadoRepository, MensagemRepository mensagemRepository, NotificacaoRepository notificacaoRepository, PasswordEncoder passwordEncoder, LoginAttemptLimiter loginAttemptLimiter) {
        this.repository = repository;
        this.pedidoRepository = pedidoRepository;
        this.pedidoContratadoRepository = pedidoContratadoRepository;
        this.mensagemRepository = mensagemRepository;
        this.notificacaoRepository = notificacaoRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptLimiter = loginAttemptLimiter;
    }

    @GetMapping("/csrf")
    public ResponseEntity<Void> csrf(CsrfToken token) { token.getToken(); return ResponseEntity.noContent().build(); }

    @PostMapping("/registrar")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse registrar(@RequestBody Usuario usuario, HttpServletRequest request) {
        if (usuario == null || vazio(usuario.getEmail()) || vazio(usuario.getSenha()) || usuario.getSenha().length() < 6
                || vazio(usuario.getNome()) || vazio(usuario.getTipo()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe nome, e-mail, tipo de conta e senha com ao menos 6 caracteres.");
        String tipo = usuario.getTipo().trim().toLowerCase(Locale.ROOT);
        if (!tipo.equals("cliente") && !tipo.equals("profissional"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de conta inválido.");
        String email = usuario.getEmail().trim().toLowerCase(Locale.ROOT);
        if (repository.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado.");
        usuario.setEmail(email);
        usuario.setTipo(tipo);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        if (tipo.equals("profissional")) usuario.setProId("pro_" + java.util.UUID.randomUUID());
        else { usuario.setProId(null); usuario.setService(null); }
        Map<String, Object> safe = sanitizarDadosFinanceiros(usuario.getExtra());
        usuario.getExtra().clear(); usuario.getExtra().putAll(safe);
        Usuario salvo = repository.save(usuario);
        estabelecerSessao(salvo, request);
        return resposta(salvo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario dados, HttpServletRequest request) {
        if (dados == null || vazio(dados.getEmail()) || vazio(dados.getSenha()))
            return ResponseEntity.badRequest().body(Map.of("message", "Informe o e-mail e a senha."));
        String address = request.getRemoteAddr();
        if (!loginAttemptLimiter.allowed(address)) return ResponseEntity.status(429).body(Map.of("message", "Muitas tentativas. Aguarde alguns minutos e tente novamente."));
        Usuario usuario = repository.findByEmailIgnoreCase(dados.getEmail().trim()).orElse(null);
        if (usuario == null || usuario.getSenha() == null || !passwordEncoder.matches(dados.getSenha(), usuario.getSenha())
                || usuario.getTipo() == null || (!usuario.getTipo().equalsIgnoreCase("cliente") && !usuario.getTipo().equalsIgnoreCase("profissional")))
        {
            loginAttemptLimiter.failed(address);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "E-mail ou senha inválidos."));
        }
        loginAttemptLimiter.succeeded(address);
        boolean removerServicoCliente = "cliente".equalsIgnoreCase(usuario.getTipo()) && usuario.getService() != null;
        if (removerServicoCliente) usuario.setService(null);
        Map<String, Object> safe = sanitizarDadosFinanceiros(usuario.getExtra());
        if (removerServicoCliente || !safe.equals(usuario.getExtra())) { usuario.getExtra().clear(); usuario.getExtra().putAll(safe); repository.save(usuario); }

        estabelecerSessao(usuario, request);
        return ResponseEntity.ok(resposta(usuario));
    }

    @GetMapping("/sessao")
    public UsuarioResponse sessao(Authentication auth) { return resposta(principal(auth)); }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
    }

    @PutMapping("/perfil")
    public UsuarioResponse atualizarPerfil(@RequestBody Usuario dados, Authentication auth) {
        Usuario atual = usuarioAutenticado(auth);
        if (dados == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados de perfil ausentes.");
        atual.setNome(dados.getNome()); atual.setCpf(dados.getCpf()); atual.setTelefone(dados.getTelefone());
        atual.setCidade(dados.getCidade()); atual.setEndereco(dados.getEndereco()); atual.setBio(dados.getBio());
        if ("cliente".equalsIgnoreCase(atual.getTipo())) atual.setService(null);
        if (dados.getBirth() != null) atual.setBirth(dados.getBirth());
        if ("profissional".equalsIgnoreCase(atual.getTipo()) && dados.getService() != null && !dados.getService().isBlank()) atual.setService(dados.getService().trim());
        if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
            if (dados.getSenha().length() < 6) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha deve ter ao menos 6 caracteres.");
            atual.setSenha(passwordEncoder.encode(dados.getSenha()));
            atual.setCredentialVersion(atual.getCredentialVersion()+1);
        }
        atual.getExtra().putAll(sanitizarDadosFinanceiros(dados.getExtra()));
        return resposta(repository.save(atual));
    }

    @PutMapping("/senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarSenha(@RequestBody AlterarSenhaRequest request, Authentication auth) {
        Usuario atual = usuarioAutenticado(auth);
        if (request == null || vazio(request.senhaAtual()) || vazio(request.novaSenha()) || request.novaSenha().length() < 6)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a senha atual e uma nova senha com ao menos 6 caracteres.");
        if (!passwordEncoder.matches(request.senhaAtual(), atual.getSenha()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha atual incorreta.");
        atual.setSenha(passwordEncoder.encode(request.novaSenha()));
        atual.setCredentialVersion(atual.getCredentialVersion()+1);
        repository.save(atual);
    }

    @GetMapping("/dados")
    public Map<String, Object> obterDados(Authentication auth) {
        Usuario usuario = usuarioAutenticado(auth);
        Object dados = usuario.getExtra().get("taskgoData");
        if (dados instanceof Map<?, ?> map) {
            Map<String, Object> resultado = new HashMap<>();
            map.forEach((key, value) -> resultado.put(String.valueOf(key), value));
            return sanitizarDadosFinanceiros(resultado);
        }
        return Map.of();
    }

    @PutMapping("/dados")
    public Map<String, Object> salvarDados(@RequestBody DadosContaRequest request, Authentication auth) {
        if (request == null || request.dados() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe os dados a salvar.");
        Usuario usuario = usuarioAutenticado(auth);
        usuario.getExtra().put("taskgoData", sanitizarDadosFinanceiros(request.dados()));
        repository.save(usuario);
        return sanitizarDadosFinanceiros(request.dados());
    }

    @DeleteMapping("/conta")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void excluirConta(@RequestBody ExcluirContaRequest request, Authentication auth, HttpServletRequest httpRequest) {
        Usuario usuario = usuarioAutenticado(auth);
        if (request == null || vazio(request.senha())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a senha da conta.");
        if (!passwordEncoder.matches(request.senha(), usuario.getSenha())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não foi possível confirmar a senha da conta.");
        List<String> pedidoIds = pedidoContratadoRepository.findByClientEmailIgnoreCaseOrProEmailIgnoreCaseOrderByCreatedDesc(usuario.getEmail(), usuario.getEmail()).stream().map(Pedido::getId).toList();
        if (!pedidoIds.isEmpty()) mensagemRepository.deleteByPedidoIdIn(pedidoIds);
        notificacaoRepository.deleteByUsuarioId(usuario.getId());
        pedidoRepository.deleteByEmailClienteIgnoreCase(usuario.getEmail());
        pedidoContratadoRepository.deleteByClientEmailIgnoreCaseOrProEmailIgnoreCase(usuario.getEmail(), usuario.getEmail());
        repository.delete(usuario);
        HttpSession session = httpRequest.getSession(false); if (session != null) session.invalidate();
    }

    private Usuario usuarioAutenticado(Authentication auth) {
        TaskgoPrincipal p = principal(auth);
        return repository.findById(p.id()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida."));
    }
    private void estabelecerSessao(Usuario usuario, HttpServletRequest request) {
        HttpSession old = request.getSession(false);
        if (old != null) old.invalidate();
        HttpSession session = request.getSession(true);
        request.changeSessionId();
        TaskgoPrincipal principal = principal(usuario);
        Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(principal, null, principal.getAuthorities());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }
    private TaskgoPrincipal principal(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof TaskgoPrincipal p)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return p;
    }
    private TaskgoPrincipal principal(Usuario u) { return new TaskgoPrincipal(u.getId(), u.getEmail(), u.getNome(), u.getTipo(), u.getProId(), u.getCredentialVersion()); }
    private UsuarioResponse resposta(Usuario u) { return new UsuarioResponse(u.getId(), u.getNome(), u.getCpf(), u.getTelefone(), u.getEmail(), u.getTipo(), u.getCidade(), u.getEndereco(), u.getBio(), u.getProId(), u.getService(), u.getBirth()); }
    private UsuarioResponse resposta(TaskgoPrincipal p) {
        Usuario u = repository.findById(p.id()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida."));
        return resposta(u);
    }
    private boolean vazio(String v) { return v == null || v.isBlank(); }

    private Map<String, Object> sanitizarDadosFinanceiros(Map<String, ?> dados) {
        Map<String, Object> resultado = new LinkedHashMap<>(); if (dados == null) return resultado;
        for (Map.Entry<String, ?> entrada : dados.entrySet()) {
            String chave = entrada.getKey();
            String normalizada = chave.toLowerCase(Locale.ROOT).replaceAll("[^a-z]", "");
            if (java.util.Set.of("balance", "pending", "availablebalance", "pendingbalance", "transactions", "transaction", "ledger", "wallet", "wallets", "withdrawals", "payouts", "plan", "subscription", "subscriptions", "verified", "faceverified", "admin", "isadmin", "role", "roles", "permissions", "notifications", "chats", "messages", "pass", "password", "senha", "passwordhash", "token", "accesstoken", "refreshtoken").contains(normalizada)) continue;
            Object valor = entrada.getValue();
            if (valor instanceof Map<?, ?> mapa) {
                Map<String, Object> nested = new LinkedHashMap<>(); mapa.forEach((k, v) -> nested.put(String.valueOf(k), v));
                resultado.put(chave, sanitizarDadosFinanceiros(nested));
            } else if (valor instanceof List<?> lista) {
                List<Object> safe = new ArrayList<>();
                for (Object item : lista) {
                    if (item instanceof Map<?, ?> mapa) { Map<String, Object> nested = new LinkedHashMap<>(); mapa.forEach((k, v) -> nested.put(String.valueOf(k), v)); safe.add(sanitizarDadosFinanceiros(nested)); }
                    else safe.add(item);
                }
                resultado.put(chave, safe);
            } else resultado.put(chave, valor);
        }
        return resultado;
    }

    public record UsuarioResponse(Long id, String nome, String cpf, String telefone, String email, String tipo,
            String cidade, String endereco, String bio, String proId, String service, String birth) {}
    public record ExcluirContaRequest(String senha) {}
    public record AlterarSenhaRequest(String senhaAtual, String novaSenha) {}
    public record DadosContaRequest(Map<String, Object> dados) {}
}
