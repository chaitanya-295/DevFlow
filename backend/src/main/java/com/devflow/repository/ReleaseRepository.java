package com.devflow.repository;

import com.devflow.model.Release;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReleaseRepository extends MongoRepository<Release, String> {
    List<Release> findByStatus(String status);
}
