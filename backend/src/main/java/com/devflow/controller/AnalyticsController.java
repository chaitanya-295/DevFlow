package com.devflow.controller;

import com.devflow.repository.IssueRepository;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public AnalyticsController(ProjectRepository projectRepository, IssueRepository issueRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalProjects", projectRepository.count());
        metrics.put("totalIssues", issueRepository.count());
        metrics.put("todoCount", issueRepository.countByStatus("To Do"));
        metrics.put("inProgressCount", issueRepository.countByStatus("In Progress"));
        metrics.put("doneCount", issueRepository.countByStatus("Done"));
        metrics.put("blockedCount", issueRepository.countByStatus("Blocked"));
        metrics.put("totalUsers", userRepository.count());
        return metrics;
    }
}
