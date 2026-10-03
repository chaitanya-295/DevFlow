package com.devflow;

import com.devflow.model.Issue;
import com.devflow.model.Project;
import com.devflow.model.Release;
import com.devflow.model.User;
import com.devflow.repository.IssueRepository;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.ReleaseRepository;
import com.devflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableMongoAuditing
public class DevFlowApplication {

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    public static void main(String[] args) {
        SpringApplication.run(DevFlowApplication.class, args);
    }
}
