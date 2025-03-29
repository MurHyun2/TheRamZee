package com.gradation.backend.user.model.dto;

import lombok.Data;

@Data
public class EmailCheckDto {

    private String email;
    private String authNum;
}