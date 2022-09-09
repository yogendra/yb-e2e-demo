package com.yugabyte.dssdemos.e2edemo;

import java.time.LocalDate;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="orders")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Order {

  @Id
  @SequenceGenerator(name="orders_id_seq", sequenceName="orders_id_seq", allocationSize=1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orders_id_seq")
  private Long id;

  private LocalDate orderDate;

  private String name;

  private String shipTo;

  private String paymentMethod;

  private String paymentId;

  private Float amount;


}
