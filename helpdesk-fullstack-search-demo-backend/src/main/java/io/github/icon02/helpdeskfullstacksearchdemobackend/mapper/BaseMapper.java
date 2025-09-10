package io.github.icon02.helpdeskfullstacksearchdemobackend.mapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public abstract class BaseMapper<FROM, TO> {
    public abstract TO map(FROM from);

    public abstract FROM unmap(TO to);

    public <T extends Collection<FROM>> List<TO> mapAsList(T collection) {
        return collection.stream().map(this::map).collect(Collectors.toList());
    }

    public <T extends Collection<FROM>> Set<TO> mapAsSet(T collection) {
        return collection.stream().map(this::map).collect(Collectors.toSet());
    }

    public <T extends Collection<TO>> List<FROM> unmapAsList(T collection) {
        return collection.stream().map(this::unmap).collect(Collectors.toList());
    }

    public <T extends Collection<TO>> Set<FROM> unmapAsSet(T collection) {
        return collection.stream().map(this::unmap).collect(Collectors.toSet());
    }
}
