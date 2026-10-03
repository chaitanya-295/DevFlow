package com.devflow.controller;

import com.devflow.model.Release;
import com.devflow.repository.ReleaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/releases")
@CrossOrigin(origins = "*")
public class ReleaseController {

    private final ReleaseRepository releaseRepository;

    public ReleaseController(ReleaseRepository releaseRepository) {
        this.releaseRepository = releaseRepository;
    }

    @GetMapping
    public List<Release> getAllReleases(@RequestParam(required = false) String status) {
        if (status != null && !status.equalsIgnoreCase("All Status")) {
            return releaseRepository.findByStatus(status.toLowerCase());
        }
        return releaseRepository.findAll();
    }

    @PostMapping
    public Release createRelease(@RequestBody Release release) {
        if (release.getStatus() == null || release.getStatus().isEmpty()) {
            release.setStatus("draft");
        }
        return releaseRepository.save(release);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRelease(@PathVariable String id) {
        releaseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
