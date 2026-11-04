package com.taskgo.api;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class RecuperacaoRateLimiter {
    private static final long WINDOW=Duration.ofMinutes(15).toMillis();
    private static final int LIMIT=5;
    private final ConcurrentHashMap<String,Janela> porIp=new ConcurrentHashMap<>();
    public boolean permitir(String ip){
        long agora=System.currentTimeMillis();
        Janela j=porIp.compute(ip,(k,old)->old==null||agora-old.inicio>=WINDOW?new Janela(agora,new AtomicInteger()):old);
        if(porIp.size()>10000)porIp.entrySet().removeIf(e->agora-e.getValue().inicio>=WINDOW);
        return j.contador.incrementAndGet()<=LIMIT;
    }
    private record Janela(long inicio,AtomicInteger contador){}
}
