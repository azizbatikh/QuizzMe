package com.quizzme.quiz.api;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.net.URI;

@RestController
public class GetQuizz {

    private static final URI OPENTDB_URL =
            URI.create("https://opentdb.com/api.php?amount=10");

    private final RestClient restClient;

    public GetQuizz(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @GetMapping(path = "/api/quizz", produces = MediaType.APPLICATION_JSON_VALUE)
    public JsonNode getQuizz() {
        return restClient.get()
                .uri(OPENTDB_URL)
                .retrieve()
                .body(JsonNode.class);
    }
}
