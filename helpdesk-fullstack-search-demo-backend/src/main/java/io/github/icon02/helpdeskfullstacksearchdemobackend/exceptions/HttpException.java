package io.github.icon02.helpdeskfullstacksearchdemobackend.exceptions;

import lombok.Getter;

@Getter
public class HttpException extends RuntimeException {
    private final Integer status;

    protected HttpException(String errorMsg, Integer status) {
        super(errorMsg);
        this.status = status;
    }

    @Getter
    public static class NotFound extends HttpException {
        private final Class<?> clazz;
        private final String id;

        public NotFound(Class<?> clazz, String id) {
            super(String.format("Cannot find Entity \"$1\" with id $2", clazz.getSimpleName(), id), 404);
            this.clazz = clazz;
            this.id = id;
        }

        public NotFound(Class<?> clazz, Long id) {
            this(clazz, String.valueOf(id));
        }
    }

    @Getter
    public static class BadRequest extends HttpException {
        public BadRequest(String msg) {
            super(msg, 400);
        }
    }
}
