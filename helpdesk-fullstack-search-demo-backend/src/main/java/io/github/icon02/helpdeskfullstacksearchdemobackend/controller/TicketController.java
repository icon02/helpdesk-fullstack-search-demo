package io.github.icon02.helpdeskfullstacksearchdemobackend.controller;

import io.github.icon02.helpdeskfullstacksearchdemobackend.exceptions.HttpException;
import io.github.icon02.helpdeskfullstacksearchdemobackend.mapper.TicketToSearchIndexMapper;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.Ticket;
import io.github.icon02.helpdeskfullstacksearchdemobackend.repository.SearchRepo;
import io.github.icon02.helpdeskfullstacksearchdemobackend.repository.TicketRepo;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketRepo repo;
    private final SearchRepo searchRepo;

    private final TicketToSearchIndexMapper ticketToSearchIndexMapper;

    @GetMapping("")
    @ResponseBody
    public PagedModel<EntityModel<Ticket>> getPage(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            PagedResourcesAssembler<Ticket> assembler) {
        var sort = Sort.by(Sort.Direction.DESC, "updatedAt");
        var pageable = PageRequest.of(page, size, sort);
        var ticketPage = repo.findAll(pageable);

        return assembler.toModel(ticketPage);
    }

    @PostMapping("")
    @ResponseStatus(value = HttpStatus.CREATED)
    @ResponseBody
    @Transactional
    public Ticket create(@RequestBody Ticket ticket, HttpServletResponse response) {
        var createdTicket = this.repo.save(ticket);

        this.updateSearchIndex(createdTicket);

        response.setHeader("Location", "/api/tickets/" + createdTicket.getId());
        return createdTicket;
    }

    @PutMapping("")
    @ResponseBody
    @Transactional
    public Ticket update(@RequestBody Ticket ticket) {
        if(ticket.getId() == null) {
            throw new HttpException.BadRequest("Cannot update without id");
        }

        var savedTicket = this.repo.save(ticket);

        this.updateSearchIndex(savedTicket);

        return savedTicket;
    }

    @GetMapping("/{id}")
    @ResponseBody
    public Ticket getById(@PathVariable Long id) {
        return this.repo.findById(id).orElseThrow(() -> new HttpException.NotFound(Ticket.class, id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        this.repo.deleteById(id);

        this.searchRepo.deleteByEntity(Ticket.class.getSimpleName(), String.valueOf(id));
    }

    private void updateSearchIndex(Ticket ticket) {
        var searchIndex = this.ticketToSearchIndexMapper.map(ticket);
        searchRepo.upsert(searchIndex);
    }
}
