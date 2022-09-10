package com.yugabyte.dssdemos.e2edemo;

import static java.lang.String.format;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/greetings")
public class GreetingService {

  @Value("${app.region:local}")
  private String location;

  @Value("${spring.datasource.url:}")
  private String dataSourceUrl;


  @GetMapping()
  public Greeting get(){
    String backend = format("location = [%1$s], datasource = [%2$s]", location, dataSourceUrl);
    return new Greeting("Hello, World!", backend);
  }
  public record Greeting (String message, String backend, LocalDateTime timestamp){
    public Greeting(String message, String backend){
      this(message, backend, LocalDateTime.now());
    }
  }
}
