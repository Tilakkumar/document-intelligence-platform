package com.docai.models;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "document_analyses")
public class DocumentAnalysis {
    
    @Id
    private String id;
    
    @Field("document_id")
    @Indexed
    private String documentId;
    
    @Field("analysis_type")
    @Indexed
    private String analysisType;
    
    @Field("status")
    @Indexed
    private String status;
    
    @Field("confidence")
    private Double confidence;
    
    @Field("processing_time")
    private Long processingTime;
    
    @Field("summary")
    private String summary;
    
    @Field("key_phrases")
    private List<String> keyPhrases;
    
    @Field("entities")
    private List<Entity> entities;
    
    @Field("sentiment")
    private Sentiment sentiment;
    
    @Field("classification")
    private Classification classification;
    
    @Field("topics")
    private List<Topic> topics;
    
    @Field("language")
    private String language;
    
    @Field("metadata")
    private Map<String, Object> metadata;
    
    @Field("error_message")
    private String errorMessage;
    
    @Field("analytics_data")
    private Map<String, Object> analyticsData;
    
    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public DocumentAnalysis() {}
    
    public DocumentAnalysis(String documentId, String analysisType) {
        this.documentId = documentId;
        this.analysisType = analysisType;
        this.status = "PENDING";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }
    
    public String getAnalysisType() { return analysisType; }
    public void setAnalysisType(String analysisType) { this.analysisType = analysisType; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    
    public Long getProcessingTime() { return processingTime; }
    public void setProcessingTime(Long processingTime) { this.processingTime = processingTime; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public List<String> getKeyPhrases() { return keyPhrases; }
    public void setKeyPhrases(List<String> keyPhrases) { this.keyPhrases = keyPhrases; }
    
    public List<Entity> getEntities() { return entities; }
    public void setEntities(List<Entity> entities) { this.entities = entities; }
    
    public Sentiment getSentiment() { return sentiment; }
    public void setSentiment(Sentiment sentiment) { this.sentiment = sentiment; }
    
    public Classification getClassification() { return classification; }
    public void setClassification(Classification classification) { this.classification = classification; }
    
    public List<Topic> getTopics() { return topics; }
    public void setTopics(List<Topic> topics) { this.topics = topics; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    
    public Map<String, Object> getAnalyticsData() { return analyticsData; }
    public void setAnalyticsData(Map<String, Object> analyticsData) { this.analyticsData = analyticsData; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Inner classes
    public static class Sentiment {
        private String label;
        private Double score;
        private Double positiveScore;
        private Double negativeScore;
        private Double neutralScore;
        
        public Sentiment() {}
        
        public Sentiment(String label, Double score) {
            this.label = label;
            this.score = score;
        }
        
        // Getters and Setters
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
        
        public Double getPositiveScore() { return positiveScore; }
        public void setPositiveScore(Double positiveScore) { this.positiveScore = positiveScore; }
        
        public Double getNegativeScore() { return negativeScore; }
        public void setNegativeScore(Double negativeScore) { this.negativeScore = negativeScore; }
        
        public Double getNeutralScore() { return neutralScore; }
        public void setNeutralScore(Double neutralScore) { this.neutralScore = neutralScore; }
    }
    
    public static class Classification {
        private String type;
        private String category;
        private Double confidence;
        private List<String> tags;
        
        public Classification() {}
        
        public Classification(String type, String category, Double confidence) {
            this.type = type;
            this.category = category;
            this.confidence = confidence;
        }
        
        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public Double getConfidence() { return confidence; }
        public void setConfidence(Double confidence) { this.confidence = confidence; }
        
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
    }
    
    public static class Topic {
        private String name;
        private Double relevance;
        private List<String> keywords;
        
        public Topic() {}
        
        public Topic(String name, Double relevance) {
            this.name = name;
            this.relevance = relevance;
        }
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public Double getRelevance() { return relevance; }
        public void setRelevance(Double relevance) { this.relevance = relevance; }
        
        public List<String> getKeywords() { return keywords; }
        public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    }
}