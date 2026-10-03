package com.devflow.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String title;
    private String description;
    private String tag; // "dev", "product", "marketing", "qa"
    private String status; // "Active", "Planning", "Archived"
    private String icon;
    private String lead;
    private String leadAvatar;
    private String leftStripe;
    private String statusBg;
    private int completedIssues;
    private int totalIssues;
    private int progress;
    private String key;
    private String team;
    private String startDate;
    private String targetEndDate;
    private String template;
    private boolean isPublic;

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();

    public Project() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getLead() { return lead; }
    public void setLead(String lead) { this.lead = lead; }

    public String getLeadAvatar() { return leadAvatar; }
    public void setLeadAvatar(String leadAvatar) { this.leadAvatar = leadAvatar; }

    public String getLeftStripe() { return leftStripe; }
    public void setLeftStripe(String leftStripe) { this.leftStripe = leftStripe; }

    public String getStatusBg() { return statusBg; }
    public void setStatusBg(String statusBg) { this.statusBg = statusBg; }

    public int getCompletedIssues() { return completedIssues; }
    public void setCompletedIssues(int completedIssues) { this.completedIssues = completedIssues; }

    public int getTotalIssues() { return totalIssues; }
    public void setTotalIssues(int totalIssues) { this.totalIssues = totalIssues; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getKey() { return key; }
    public void setKey(String key) { this.key = key; }

    public String getTeam() { return team; }
    public void setTeam(String team) { this.team = team; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getTargetEndDate() { return targetEndDate; }
    public void setTargetEndDate(String targetEndDate) { this.targetEndDate = targetEndDate; }

    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
