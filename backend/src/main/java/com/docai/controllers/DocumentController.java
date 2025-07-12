package com.docai.controllers;

import com.docai.models.Document;
import com.docai.models.DocumentAnalysis;
import com.docai.models.Entity;
import com.docai.services.DocumentService;
import com.docai.services.DocumentAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentAnalysisService analysisService;

    /**
     * Upload and process a document
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            Document document = documentService.processDocument(file);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Document processing failed: " + e.getMessage()));
        }
    }

    /**
     * Get document by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable String id) {
        try {
            Optional<Document> document = documentService.getDocument(id);
            if (document.isPresent()) {
                return ResponseEntity.ok(document.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve document: " + e.getMessage()));
        }
    }

    /**
     * Analyze document content
     */
    @PostMapping("/{id}/analyze")
    public ResponseEntity<?> analyzeDocument(
            @PathVariable String id,
            @RequestBody Map<String, Object> request) {
        try {
            String analysisType = (String) request.getOrDefault("analysis_type", "comprehensive");
            DocumentAnalysis analysis = analysisService.analyzeDocument(id, analysisType);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Document analysis failed: " + e.getMessage()));
        }
    }

    /**
     * Get extracted entities from document
     */
    @GetMapping("/{id}/entities")
    public ResponseEntity<?> getDocumentEntities(@PathVariable String id) {
        try {
            List<Entity> entities = analysisService.getEntities(id);
            return ResponseEntity.ok(Map.of("entities", entities));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve entities: " + e.getMessage()));
        }
    }

    /**
     * Classify document type
     */
    @PostMapping("/classify")
    public ResponseEntity<?> classifyDocument(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Text content is required"));
            }
            
            String classification = analysisService.classifyDocument(text);
            return ResponseEntity.ok(Map.of("classification", classification));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Document classification failed: " + e.getMessage()));
        }
    }

    /**
     * Search documents
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchDocuments(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Document> documents = documentService.searchDocuments(query, type, page, size);
            return ResponseEntity.ok(Map.of("documents", documents));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Search failed: " + e.getMessage()));
        }
    }

    /**
     * Get document statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getDocumentStats() {
        try {
            Map<String, Object> stats = documentService.getDocumentStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve statistics: " + e.getMessage()));
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "healthy",
                "timestamp", System.currentTimeMillis()
        ));
    }
}