package com.example.backend.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.example.backend.adapter.inbound.web.dto.UserRequest;
import com.example.backend.adapter.inbound.web.dto.UserResponse;
import com.example.backend.adapter.inbound.web.dto.UserUpdateRequest;
import com.example.backend.adapter.outbound.persistence.UsuarioJpaRepository;
import com.example.backend.domain.exception.UserNotFoundException;
import com.example.ejb.Usuario;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UsuarioJpaRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setUsername("joao");
        usuario.setPassword("encoded-pass");
        usuario.setNome("João Silva");
        usuario.setRole("USER");
        usuario.setAtivo(true);
        usuario.setVersion(0L);
    }

    @Test
    void shouldListAllUsers() {
        when(repository.findAll()).thenReturn(List.of(usuario));

        List<UserResponse> result = userService.listAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).username()).isEqualTo("joao");
    }

    @Test
    void shouldGetUserById() {
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        UserResponse result = userService.getById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.username()).isEqualTo("joao");
    }

    @Test
    void shouldThrowWhenGetByIdNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getById(99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void shouldCreateUser() {
        UserRequest request = new UserRequest("novo", "senha123", "Novo Usuário", "USER");
        when(repository.findByUsername("novo")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("senha123")).thenReturn("encoded-senha123");
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setId(2L);
            return u;
        });

        UserResponse result = userService.create(request);

        assertThat(result.id()).isEqualTo(2L);
        assertThat(result.username()).isEqualTo("novo");
        assertThat(result.role()).isEqualTo("USER");
        assertThat(result.ativo()).isTrue();
    }

    @Test
    void shouldThrowWhenCreateWithDuplicateUsername() {
        UserRequest request = new UserRequest("joao", "senha123", "João Duplicado", "USER");
        when(repository.findByUsername("joao")).thenReturn(Optional.of(usuario));

        assertThatThrownBy(() -> userService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username já existe");
    }

    @Test
    void shouldThrowWhenCreateWithInvalidRole() {
        UserRequest request = new UserRequest("novo", "senha123", "Novo", "INVALID_ROLE");
        when(repository.findByUsername("novo")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Role inválida");
    }

    @Test
    void shouldCreateUserWithDefaultRoleWhenRoleIsNull() {
        UserRequest request = new UserRequest("novo", "senha123", "Novo Usuário", null);
        when(repository.findByUsername("novo")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("senha123")).thenReturn("encoded");
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setId(2L);
            return u;
        });

        UserResponse result = userService.create(request);

        assertThat(result.role()).isEqualTo("USER");
    }

    @Test
    void shouldUpdateUser() {
        UserUpdateRequest request = new UserUpdateRequest("joao.atualizado", null, "João Atualizado", "ADMIN");
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(repository.findByUsername("joao.atualizado")).thenReturn(Optional.empty());
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        UserResponse result = userService.update(1L, request);

        assertThat(result.username()).isEqualTo("joao.atualizado");
        assertThat(result.nome()).isEqualTo("João Atualizado");
        assertThat(result.role()).isEqualTo("ADMIN");
    }

    @Test
    void shouldThrowWhenUpdateWithBlankUsername() {
        UserUpdateRequest request = new UserUpdateRequest("", null, "Nome", "USER");

        assertThatThrownBy(() -> userService.update(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username não pode ser vazio");
    }

    @Test
    void shouldThrowWhenUpdateUserNotFound() {
        UserUpdateRequest request = new UserUpdateRequest("username", null, "Nome", "USER");
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.update(99L, request))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void shouldThrowWhenUpdateWithDuplicateUsername() {
        Usuario outro = new Usuario();
        outro.setId(2L);
        outro.setUsername("joao");

        UserUpdateRequest request = new UserUpdateRequest("joao", null, "Nome", "USER");
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(repository.findByUsername("joao")).thenReturn(Optional.of(outro));

        assertThatThrownBy(() -> userService.update(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username já está em uso");
    }

    @Test
    void shouldThrowWhenUpdateWithInvalidRole() {
        UserUpdateRequest request = new UserUpdateRequest("joao", null, "Nome", "INVALID");
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(repository.findByUsername("joao")).thenReturn(Optional.of(usuario));

        assertThatThrownBy(() -> userService.update(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Role inválida");
    }

    @Test
    void shouldDeleteUser() {
        when(repository.existsById(1L)).thenReturn(true);
        doNothing().when(repository).deleteById(1L);

        userService.delete(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void shouldThrowWhenDeleteUserNotFound() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> userService.delete(99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void shouldGetCurrentUser() {
        Authentication auth = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("joao");
        SecurityContextHolder.setContext(securityContext);

        when(repository.findByUsername("joao")).thenReturn(Optional.of(usuario));

        UserResponse result = userService.getCurrentUser();

        assertThat(result.username()).isEqualTo("joao");
        assertThat(result.nome()).isEqualTo("João Silva");
    }

    @Test
    void shouldThrowWhenGetCurrentUserNotFound() {
        Authentication auth = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn("unknown");
        SecurityContextHolder.setContext(securityContext);

        when(repository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getCurrentUser())
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void shouldResetPassword() {
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.encode(anyString())).thenReturn("new-encoded");
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        String newPassword = userService.resetPassword(1L);

        assertThat(newPassword).isNotNull();
        assertThat(newPassword.length()).isEqualTo(12);
        verify(passwordEncoder).encode(anyString());
        verify(repository).save(usuario);
    }

    @Test
    void shouldThrowWhenResetPasswordWithNullId() {
        assertThatThrownBy(() -> userService.resetPassword(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("ID do usuário não pode ser nulo");
    }

    @Test
    void shouldThrowWhenResetPasswordUserNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.resetPassword(99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("Usuário não encontrado");
    }

    @Test
    void shouldThrowWhenResetPasswordUserHasNullPassword() {
        usuario.setPassword(null);
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        assertThatThrownBy(() -> userService.resetPassword(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Usuário sem senha cadastrada");
    }
}
