package com.docai.models;

import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Map;

public class Entity {
    
    @Field("type")
    private String type;
    
    @Field("text")
    private String text;
    
    @Field("confidence")
    private Double confidence;
    
    @Field("start_offset")
    private Integer startOffset;
    
    @Field("end_offset")
    private Integer endOffset;
    
    @Field("category")
    private String category;
    
    @Field("subcategory")
    private String subcategory;
    
    @Field("normalized_value")
    private String normalizedValue;
    
    @Field("metadata")
    private Map<String, Object> metadata;
    
    // Constructors
    public Entity() {}
    
    public Entity(String type, String text, Double confidence) {
        this.type = type;
        this.text = text;
        this.confidence = confidence;
    }
    
    public Entity(String type, String text, Double confidence, Integer startOffset, Integer endOffset) {
        this.type = type;
        this.text = text;
        this.confidence = confidence;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
    }
    
    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    
    public Integer getStartOffset() { return startOffset; }
    public void setStartOffset(Integer startOffset) { this.startOffset = startOffset; }
    
    public Integer getEndOffset() { return endOffset; }
    public void setEndOffset(Integer endOffset) { this.endOffset = endOffset; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    
    public String getNormalizedValue() { return normalizedValue; }
    public void setNormalizedValue(String normalizedValue) { this.normalizedValue = normalizedValue; }
    
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    
    @Override
    public String toString() {
        return "Entity{" +
                "type='" + type + '\'' +
                ", text='" + text + '\'' +
                ", confidence=" + confidence +
                ", startOffset=" + startOffset +
                ", endOffset=" + endOffset +
                ", category='" + category + '\'' +
                '}';
    }
}