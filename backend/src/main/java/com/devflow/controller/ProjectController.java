package com.devflow.controller;

import com.devflow.model.Project;
import com.devflow.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ProjectController(ProjectRepository projectRepository, SimpMessagingTemplate messagingTemplate) {
        this.projectRepository = projectRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public List<Project> getAllProjects(@RequestParam(required = false) String status) {
        if (status != null && !status.equalsIgnoreCase("All Status")) {
            return projectRepository.findByStatus(status);
        }
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        if (project.getIcon() == null || project.getIcon().isEmpty()) {
            project.setIcon("📁");
        }
        if (project.getStatus() == null || project.getStatus().isEmpty()) {
            project.setStatus("Planning");
        }
        if (project.getLeftStripe() == null) {
            project.setLeftStripe("border-l-blue-500");
        }
        if (project.getStatusBg() == null) {
            project.setStatusBg("bg-blue-900/40 text-blue-300 border-blue-700/40");
        }
        Project saved = projectRepository.save(project);

        // Real-time broadcast to subscribers
        messagingTemplate.convertAndSend("/topic/projects", saved);
        return saved;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectRepository.deleteById(id);
        messagingTemplate.convertAndSend("/topic/projects/deleted", id);
        return ResponseEntity.noContent().build();
    }
}
