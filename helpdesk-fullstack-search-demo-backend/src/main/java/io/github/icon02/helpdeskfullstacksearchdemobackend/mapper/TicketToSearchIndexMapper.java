package io.github.icon02.helpdeskfullstacksearchdemobackend.mapper;

import io.github.icon02.helpdeskfullstacksearchdemobackend.model.SearchIndex;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.Tag;
import io.github.icon02.helpdeskfullstacksearchdemobackend.model.Ticket;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class TicketToSearchIndexMapper extends BaseMapper<Ticket, SearchIndex> {

    @Override
    public SearchIndex map(Ticket ticket) {
        String[] tags = new String[0];
        if (ticket.getTags() != null) {
            final String[] newTags = new String[ticket.getTags().size()];
            AtomicInteger index = new AtomicInteger();
            ticket.getTags().forEach((tag) -> {
                newTags[index.getAndIncrement()] = tag.getName();
            });

            tags = newTags;
        }

        return new SearchIndex(
                new SearchIndex.ID(Ticket.class.getSimpleName(), String.valueOf(ticket.getId()), ticket.getLanguage()),
                ticket.getTitle(),
                ticket.getDescription(),
                tags,
                "/tickets/" + ticket.getId(),
                new Date()
        );
    }

    @Override
    @Deprecated
    public Ticket unmap(SearchIndex searchIndex) {
        throw new UnsupportedOperationException("Cannot map from SearchIndex to Ticket");
    }

    @Override
    @Deprecated
    public <T extends Collection<SearchIndex>> Set<Ticket> unmapAsSet(T collection) {
        throw new UnsupportedOperationException("Cannot map from SearchIndex to Ticket");
    }

    @Override
    @Deprecated
    public <T extends Collection<SearchIndex>> List<Ticket> unmapAsList(T collection) {
        throw new UnsupportedOperationException("Cannot map from SearchIndex to Ticket");
    }
}
