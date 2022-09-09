package com.yugabyte.dssdemos.e2edemo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.YugabyteYSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@Testcontainers
class E2eDemoApplicationTests {

  @Container
  public static YugabyteYSQLContainer container = new YugabyteYSQLContainer(
    "yugabytedb/yugabyte:2.15.1.0-b175")
    .withDatabaseName("yugabyte")
    .withUsername("yugabyte")
    .withPassword("yugabyte")
    .withReuse(true);

  @DynamicPropertySource
  static void datasourceProps(final DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", container::getJdbcUrl);
    registry.add("spring.datasource.username", container::getUsername);
    registry.add("spring.datasource.password", container::getPassword);
    registry.add("spring.datasource.driver-class-name", () -> "com.yugabyte.Driver");
  }
	@Test
	void contextLoads() {
	}

}
