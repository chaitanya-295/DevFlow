package com.devflow.controller;

import com.devflow.model.Issue;
import com.devflow.repository.IssueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/issues")
@CrossOrigin(origins = "*")
public class IssueController {

    private final IssueRepository issueRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public IssueController(IssueRepository issueRepository, SimpMessagingTemplate messagingTemplate) {
        this.issueRepository = issueRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public List<Issue> getAllIssues(
            @RequestParam(required = false) String project,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String assignee) {

        if (project != null && !project.isEmpty()) {
            return issueRepository.findByProject(project);
        }
        if (status != null && !status.isEmpty()) {
            return issueRepository.findByStatus(status);
        }
        if (priority != null && !priority.isEmpty()) {
            return issueRepository.findByPriority(priority);
        }
        if (assignee != null && !assignee.isEmpty()) {
            return issueRepository.findByAssignee(assignee);
        }
        return issueRepository.findAll();
    }

    @PostMapping
    public Issue createIssue(@RequestBody Issue issue) {
        if (issue.getKey() == null || issue.getKey().isEmpty()) {
            issue.setKey("DEV-" + (100 + new Random().nextInt(900)));
        }
        if (issue.getStatus() == null || issue.getStatus().isEmpty()) {
            issue.setStatus("To Do");
        }
        if (issue.getPriority() == null || issue.getPriority().isEmpty()) {
            issue.setPriority("Medium");
        }
        if (issue.getStoryPoints() == null || issue.getStoryPoints().isEmpty()) {
            issue.setStoryPoints("3 pts");
        }
        Issue saved = issueRepository.save(issue);

        // Real-time broadcast
        messagingTemplate.convertAndSend("/topic/issues", saved);
        return saved;
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Issue> updateIssueStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return issueRepository.findById(id)
                .map(issue -> {
                    issue.setStatus(newStatus);
                    Issue updated = issueRepository.save(issue);
                    messagingTemplate.convertAndSend("/topic/issues/updated", updated);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable String id) {
        issueRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/issues/deleted", id);
        return ResponseEntity.noContent().build();
    }
}
