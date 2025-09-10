package io.github.icon02.helpdeskfullstacksearchdemobackend.controller;

import io.github.icon02.helpdeskfullstacksearchdemobackend.exceptions.HttpException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ControllerAdvise {

    @ExceptionHandler(HttpException.class)
    public ResponseEntity<Void> handleHttpException(HttpException ex) {
        return ResponseEntity.status(ex.getStatus()).build();
    }
}
