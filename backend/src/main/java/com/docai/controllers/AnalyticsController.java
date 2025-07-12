package com.docai.controllers;

import com.docai.models.DocumentAnalysis;
import com.docai.services.DocumentAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    @Autowired
    private DocumentAnalysisService analysisService;
    
    @PostMapping("/documents/{documentId}/analyze")
    public ResponseEntity<?> analyzeDocument(
            @PathVariable String documentId,
            @RequestBody Map<String, String> request) {
        
        try {
            String analysisType = request.getOrDefault("analysisType", "comprehensive");
            
            DocumentAnalysis analysis = analysisService.analyzeDocument(documentId, analysisType);
            
            return ResponseEntity.ok(analysis);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Analysis failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/documents/{documentId}/analyses")
    public ResponseEntity<List<DocumentAnalysis>> getDocumentAnalyses(@PathVariable String documentId) {
        List<DocumentAnalysis> analyses = analysisService.getAnalysesByDocument(documentId);
        return ResponseEntity.ok(analyses);
    }
    
    @GetMapping("/analyses")
    public ResponseEntity<List<DocumentAnalysis>> getAnalysesByType(@RequestParam String type) {
        List<DocumentAnalysis> analyses = analysisService.getAnalysesByType(type);
        return ResponseEntity.ok(analyses);
    }
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAnalyticsStatus() {
        Map<String, Object> status = Map.of(
            "status", "active",
            "version", "1.0.0",
            "supportedAnalysisTypes", List.of(
                "entity_extraction",
                "classification",
                "summarization",
                "sentiment_analysis",
                "comprehensive"
            )
        );
        return ResponseEntity.ok(status);
    }
}