package io.github.icon02.helpdeskfullstacksearchdemobackend.controller;

import io.github.icon02.helpdeskfullstacksearchdemobackend.model.SearchHit;
import io.github.icon02.helpdeskfullstacksearchdemobackend.repository.SearchRepo;
import io.github.icon02.helpdeskfullstacksearchdemobackend.util.SearchTermUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bff")
@RequiredArgsConstructor
public class BffController {

    private final SearchRepo searchRepo;

    @GetMapping("/search")
    @ResponseBody
    public List<SearchHit> search(@RequestParam("term") String searchTerm) {
        var repoSearchTerm = SearchTermUtil.toTsQuery(searchTerm);

        return searchRepo.find(repoSearchTerm, "pg_catalog.simple", 20, 0);
    }
}
