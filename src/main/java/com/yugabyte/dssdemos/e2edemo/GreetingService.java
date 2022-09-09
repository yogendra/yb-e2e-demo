package com.yugabyte.dssdemos.e2edemo;

import java.time.LocalDateTime;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/greetings")
public class GreetingService {
  @GetMapping()
  public Greeting get(){
    return new Greeting("Hello, World!");
  }
  public record Greeting (String message, LocalDateTime timestamp){
    public Greeting(String message){
      this(message, LocalDateTime.now());
    }
  }
}
