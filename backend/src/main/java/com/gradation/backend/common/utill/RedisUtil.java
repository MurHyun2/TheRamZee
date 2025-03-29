package com.gradation.backend.common.utill;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisTemplate<String, String> redisTemplate1;
    public RedisUtil(RedisTemplate<String, Object> redisTemplate,@Qualifier("redisTemplate1") RedisTemplate<String, String> redisTemplate1) {
        this.redisTemplate = redisTemplate;
        this.redisTemplate1 = redisTemplate1;
    }

    public void setex(String key, String value, long timeout, TimeUnit unit) {
        redisTemplate1.opsForValue().set(key, value, timeout, unit);
    }

    public Object get(String key) {
        return redisTemplate1.opsForValue().get(key);
    }

    public void delete(String key) {
        redisTemplate1.delete(key);
    }

    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate1.hasKey(key));
    }

    public void del(String key) {
        redisTemplate.delete(key);
    }

    public void hset(String key, String hashKey, Object value) {
        redisTemplate.opsForHash().put(key, hashKey, value);
    }

    public Map<Object, Object> hgetAll(String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    public Object hget(String key, String hashKey) {
        return redisTemplate.opsForHash().get(key, hashKey);
    }

}

