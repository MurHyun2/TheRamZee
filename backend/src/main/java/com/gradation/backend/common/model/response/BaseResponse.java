package com.gradation.backend.common.model.response;

import lombok.Getter;
import lombok.Setter;


/**
 * BaseResponse는 기본적인 json 전송 방식을 정의합니다..
 */
@Getter
@Setter
public class BaseResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String errorCode;

    public BaseResponse(boolean success, String message, T data, String errorCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
    }

    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(true, "Success", data, null);
    }

    public static <T> BaseResponse<T> success(String message, T data) {
        return new BaseResponse<>(true, message, data, null);
    }

    public static <T> BaseResponse<T> error(String message) {
        return new BaseResponse<>(false, message, null, null);
    }
    public static <T> BaseResponse<T> error(String message, String errorCode) {
        return new BaseResponse<>(false, message, null, errorCode);
    }
}

