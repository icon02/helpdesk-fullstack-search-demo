package io.github.icon02.helpdeskfullstacksearchdemobackend.controller;

import io.github.icon02.helpdeskfullstacksearchdemobackend.exceptions.HttpException;
import io.github.icon02.helpdeskfullstacksearchdemobackend.mapper.ArticleToSearchIndexMapper;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.Article;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.Ticket;
import io.github.icon02.helpdeskfullstacksearchdemobackend.repository.ArticleRepo;
import io.github.icon02.helpdeskfullstacksearchdemobackend.repository.SearchRepo;
import jakarta.annotation.PostConstruct;
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

import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleRepo articleRepo;
    private final SearchRepo searchRepo;

    private final ArticleToSearchIndexMapper articleToSearchIndexMapper;

    @GetMapping("")
    @ResponseBody
    public PagedModel<EntityModel<Article>> getPage(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "50") int size,
            PagedResourcesAssembler<Article> assembler) {
        var sort = Sort.by(Sort.Direction.DESC, "updatedAt");
        var pageable = PageRequest.of(page, size, sort);
        var articlePage = articleRepo.findAll(pageable);

        return assembler.toModel(articlePage);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    @Transactional
    public Article createArticle(@RequestBody Article article, HttpServletResponse response) {
        var createdArticle = articleRepo.save(article);

        this.updateSearchIndex(createdArticle);

        response.setHeader("Location", "/api/articles/" + createdArticle.getId());
        return createdArticle;
    }

    @PutMapping("")
    @ResponseBody
    @Transactional
    public Article updateArticle(@RequestBody Article article) {
        if(article.getId() == null) {
            throw new HttpException.BadRequest("Cannot update without id");
        }

        var updatedArticle = articleRepo.save(article);

        this.updateSearchIndex(updatedArticle);

        return updatedArticle;
    }

    @GetMapping("/{id}")
    @ResponseBody
    public Article getArticleById(@PathVariable Long id) {
        return articleRepo.findById(id).orElseThrow(() -> new HttpException.NotFound(Article.class, id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteArticleById(@PathVariable Long id) {
        articleRepo.deleteById(id);

        this.searchRepo.deleteByEntity(Article.class.getSimpleName(), String.valueOf(id));
    }

    private void updateSearchIndex(Article article) {
        var searchIndex = this.articleToSearchIndexMapper.map(article);
        searchRepo.upsert(searchIndex);
    }
}
