package com.yugabyte.dssdemos.e2edemo;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@RepositoryRestResource()
public interface OrderRepository extends PagingAndSortingRepository<Order, Long> {

}
