package com.docai.models;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "documents")
public class Document {
    
    @Id
    private String id;
    
    @Field("filename")
    @Indexed
    private String filename;
    
    @Field("original_filename")
    private String originalFilename;
    
    @Field("content_type")
    @Indexed
    private String contentType;
    
    @Field("file_size")
    private Long fileSize;
    
    @Field("file_path")
    private String filePath;
    
    @Field("extracted_text")
    @TextIndexed
    private String extractedText;
    
    @Field("processed")
    @Indexed
    private Boolean processed = false;
    
    @Field("processing_status")
    private String processingStatus;
    
    @Field("classification")
    @Indexed
    private String classification;
    
    @Field("confidence_score")
    private Double confidenceScore;
    
    @Field("entities")
    private List<Entity> entities;
    
    @Field("metadata")
    private Map<String, Object> metadata;
    
    @Field("tags")
    @Indexed
    private List<String> tags;
    
    @Field("uploaded_by")
    @Indexed
    private String uploadedBy;
    
    @Field("language")
    private String language;
    
    @Field("page_count")
    private Integer pageCount;
    
    @Field("checksum")
    private String checksum;
    
    @CreatedDate
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Document() {}
    
    public Document(String filename, String contentType, Long fileSize, String filePath) {
        this.filename = filename;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.processed = false;
        this.processingStatus = "PENDING";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    
    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }
    
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }
    
    public Boolean getProcessed() { return processed; }
    public void setProcessed(Boolean processed) { this.processed = processed; }
    
    public String getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }
    
    public String getClassification() { return classification; }
    public void setClassification(String classification) { this.classification = classification; }
    
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public List<Entity> getEntities() { return entities; }
    public void setEntities(List<Entity> entities) { this.entities = entities; }
    
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public Integer getPageCount() { return pageCount; }
    public void setPageCount(Integer pageCount) { this.pageCount = pageCount; }
    
    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}