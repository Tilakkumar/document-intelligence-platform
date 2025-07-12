package com.docai.services;

import com.docai.models.Document;
import com.docai.models.DocumentAnalysis;
import com.docai.models.Entity;
import com.docai.repositories.AnalyticsRepository;
import com.docai.repositories.DocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DocumentAnalysisService {
    
    private static final Logger logger = LoggerFactory.getLogger(DocumentAnalysisService.class);
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private AnalyticsRepository analyticsRepository;
    
    @Autowired
    private OpenAIService openAIService;
    
    public DocumentAnalysis analyzeDocument(String documentId, String analysisType) {
        logger.info("Starting document analysis: {} - {}", documentId, analysisType);
        
        Optional<Document> documentOpt = documentRepository.findById(documentId);
        if (documentOpt.isEmpty()) {
            throw new RuntimeException("Document not found: " + documentId);
        }
        
        Document document = documentOpt.get();
        if (document.getExtractedText() == null || document.getExtractedText().isEmpty()) {
            throw new RuntimeException("Document text not available for analysis");
        }
        
        DocumentAnalysis analysis = new DocumentAnalysis(documentId, analysisType);
        analysis.setStatus("PROCESSING");
        analysis = analyticsRepository.save(analysis);
        
        try {
            long startTime = System.currentTimeMillis();
            
            switch (analysisType.toLowerCase()) {
                case "entity_extraction":
                    performEntityExtraction(analysis, document.getExtractedText());
                    break;
                case "classification":
                    performClassification(analysis, document.getExtractedText());
                    break;
                case "summarization":
                    performSummarization(analysis, document.getExtractedText());
                    break;
                case "sentiment_analysis":
                    performSentimentAnalysis(analysis, document.getExtractedText());
                    break;
                case "comprehensive":
                    performComprehensiveAnalysis(analysis, document.getExtractedText());
                    break;
                default:
                    throw new RuntimeException("Unknown analysis type: " + analysisType);
            }
            
            long endTime = System.currentTimeMillis();
            analysis.setProcessingTime(endTime - startTime);
            analysis.setStatus("COMPLETED");
            
            logger.info("Document analysis completed: {} - {}", documentId, analysisType);
            
        } catch (Exception e) {
            logger.error("Error during document analysis: {} - {}", documentId, analysisType, e);
            analysis.setStatus("FAILED");
            analysis.setErrorMessage(e.getMessage());
        }
        
        return analyticsRepository.save(analysis);
    }
    
    public String classifyDocument(String text) {
        logger.info("Classifying document text");
        return openAIService.classifyDocument(text);
    }
    
    public List<DocumentAnalysis> getAnalysesByDocument(String documentId) {
        return analyticsRepository.findByDocumentId(documentId);
    }
    
    public List<DocumentAnalysis> getAnalysesByType(String analysisType) {
        return analyticsRepository.findByAnalysisType(analysisType);
    }
    
    private void performEntityExtraction(DocumentAnalysis analysis, String text) {
        logger.info("Performing entity extraction");
        
        Map<String, Object> result = openAIService.extractEntities(text);
        
        if (result.containsKey("entities")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> entityMaps = (List<Map<String, Object>>) result.get("entities");
            
            List<Entity> entities = entityMaps.stream()
                .map(this::mapToEntity)
                .toList();
            
            analysis.setEntities(entities);
            analysis.setConfidence(calculateAverageConfidence(entities));
        }
    }
    
    private void performClassification(DocumentAnalysis analysis, String text) {
        logger.info("Performing document classification");
        
        String classification = openAIService.classifyDocument(text);
        
        DocumentAnalysis.Classification classificationResult = new DocumentAnalysis.Classification();
        classificationResult.setType(classification);
        classificationResult.setConfidence(0.85); // Default confidence
        
        analysis.setClassification(classificationResult);
        analysis.setConfidence(0.85);
    }
    
    private void performSummarization(DocumentAnalysis analysis, String text) {
        logger.info("Performing document summarization");
        
        String summary = openAIService.summarizeDocument(text);
        
        analysis.setSummary(summary);
        analysis.setConfidence(0.90); // Default confidence for summarization
    }
    
    private void performSentimentAnalysis(DocumentAnalysis analysis, String text) {
        logger.info("Performing sentiment analysis");
        
        Map<String, Object> sentimentResult = openAIService.analyzeSentiment(text);
        
        DocumentAnalysis.Sentiment sentiment = new DocumentAnalysis.Sentiment();
        sentiment.setLabel((String) sentimentResult.get("sentiment"));
        sentiment.setScore(((Number) sentimentResult.get("confidence")).doubleValue());
        
        if (sentimentResult.containsKey("scores")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> scores = (Map<String, Object>) sentimentResult.get("scores");
            sentiment.setPositiveScore(((Number) scores.get("positive")).doubleValue());
            sentiment.setNegativeScore(((Number) scores.get("negative")).doubleValue());
            sentiment.setNeutralScore(((Number) scores.get("neutral")).doubleValue());
        }
        
        analysis.setSentiment(sentiment);
        analysis.setConfidence(sentiment.getScore());
    }
    
    private void performComprehensiveAnalysis(DocumentAnalysis analysis, String text) {
        logger.info("Performing comprehensive analysis");
        
        // Perform all analysis types
        performEntityExtraction(analysis, text);
        performClassification(analysis, text);
        performSummarization(analysis, text);
        performSentimentAnalysis(analysis, text);
        
        // Calculate overall confidence
        double overallConfidence = calculateOverallConfidence(analysis);
        analysis.setConfidence(overallConfidence);
    }
    
    private Entity mapToEntity(Map<String, Object> entityMap) {
        Entity entity = new Entity();
        entity.setType((String) entityMap.get("type"));
        entity.setText((String) entityMap.get("text"));
        
        if (entityMap.containsKey("confidence")) {
            entity.setConfidence(((Number) entityMap.get("confidence")).doubleValue());
        }
        
        if (entityMap.containsKey("startOffset")) {
            entity.setStartOffset(((Number) entityMap.get("startOffset")).intValue());
        }
        
        if (entityMap.containsKey("endOffset")) {
            entity.setEndOffset(((Number) entityMap.get("endOffset")).intValue());
        }
        
        return entity;
    }
    
    private double calculateAverageConfidence(List<Entity> entities) {
        if (entities.isEmpty()) return 0.0;
        
        return entities.stream()
            .filter(entity -> entity.getConfidence() != null)
            .mapToDouble(Entity::getConfidence)
            .average()
            .orElse(0.0);
    }
    
    private double calculateOverallConfidence(DocumentAnalysis analysis) {
        double totalConfidence = 0.0;
        int count = 0;
        
        if (analysis.getEntities() != null && !analysis.getEntities().isEmpty()) {
            totalConfidence += calculateAverageConfidence(analysis.getEntities());
            count++;
        }
        
        if (analysis.getClassification() != null && analysis.getClassification().getConfidence() != null) {
            totalConfidence += analysis.getClassification().getConfidence();
            count++;
        }
        
        if (analysis.getSentiment() != null && analysis.getSentiment().getScore() != null) {
            totalConfidence += analysis.getSentiment().getScore();
            count++;
        }
        
        return count > 0 ? totalConfidence / count : 0.0;
    }
}