package io.github.icon02.helpdeskfullstacksearchdemobackend.controller;

import io.github.icon02.helpdeskfullstacksearchdemobackend.exceptions.HttpException;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.User;
import io.github.icon02.helpdeskfullstacksearchdemobackend.repository.UserRepo;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.*;

import java.util.TreeSet;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepo repo;

    @GetMapping("")
    @ResponseBody
    public PagedModel<EntityModel<User>> getPage(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            PagedResourcesAssembler<User> assembler) {
        var pageable = PageRequest.of(page, size);
        var users = repo.findAll(pageable);

        return assembler.toModel(users);
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return repo.findUserByEmail(email).orElseThrow(() -> new HttpException.NotFound(User.class, email));
    }

    @GetMapping("/email-options")
    @ResponseBody
    public PagedModel<String> getUserEmailOptions() {
        var emails = repo.findAll().stream()
                .map(User::getEmail)
                .collect(Collectors.toCollection(TreeSet::new));

        return PagedModel.of(
                emails,
                new PagedModel.PageMetadata(emails.size(), 0, emails.size(), 1)
        );
    }

    @PostMapping("")
    @ResponseBody
    public User createUser(@RequestBody User user, HttpServletResponse response) {
        var createdUser = repo.save(user);
        response.setHeader("Location", "/api/users/" + createdUser.getId());
        return createdUser;
    }
}
