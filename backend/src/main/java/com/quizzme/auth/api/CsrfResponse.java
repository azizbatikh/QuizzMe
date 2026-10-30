package com.quizzme.auth.api;

public record CsrfResponse(String headerName, String token) {
}
