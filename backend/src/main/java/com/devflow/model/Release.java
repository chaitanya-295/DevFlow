package com.devflow.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "releases")
public class Release {
    @Id
    private String id;
    private String version;
    private String releaseDate;
    private String status; // "released", "draft"
    private int fixes;
    private int bugs;
    private int features;
    private int downloads;
    private String description;

    @CreatedDate
    private Instant createdAt = Instant.now();

    public Release() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getFixes() { return fixes; }
    public void setFixes(int fixes) { this.fixes = fixes; }

    public int getBugs() { return bugs; }
    public void setBugs(int bugs) { this.bugs = bugs; }

    public int getFeatures() { return features; }
    public void setFeatures(int features) { this.features = features; }

    public int getDownloads() { return downloads; }
    public void setDownloads(int downloads) { this.downloads = downloads; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
