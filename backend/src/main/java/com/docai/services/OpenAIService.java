package com.docai.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {
    
    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);
    
    @Value("${openai.api.key}")
    private String apiKey;
    
    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public String analyzeDocument(String text, String analysisType) {
        logger.info("Analyzing document with OpenAI, type: {}", analysisType);
        
        String prompt = buildPrompt(text, analysisType);
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o");
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("max_tokens", 2000);
            requestBody.put("temperature", 0.3);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                String result = responseJson.path("choices").get(0).path("message").path("content").asText();
                logger.info("OpenAI analysis completed successfully");
                return result;
            } else {
                logger.error("OpenAI API request failed with status: {}", response.getStatusCode());
                return "Analysis failed";
            }
            
        } catch (Exception e) {
            logger.error("Error calling OpenAI API", e);
            return "Analysis failed: " + e.getMessage();
        }
    }
    
    public Map<String, Object> extractEntities(String text) {
        logger.info("Extracting entities with OpenAI");
        
        String prompt = """
            Extract named entities from the following text and return them in JSON format.
            Include the following entity types: PERSON, ORGANIZATION, LOCATION, DATE, MONEY, PERCENTAGE, EMAIL, PHONE.
            
            Format the response as:
            {
                "entities": [
                    {
                        "text": "entity text",
                        "type": "PERSON",
                        "confidence": 0.95
                    }
                ]
            }
            
            Text: %s
            """.formatted(text);
        
        try {
            String response = analyzeDocument(text, "entity_extraction");
            return objectMapper.readValue(response, Map.class);
        } catch (Exception e) {
            logger.error("Error extracting entities", e);
            return Map.of("entities", List.of());
        }
    }
    
    public String classifyDocument(String text) {
        logger.info("Classifying document with OpenAI");
        
        String prompt = """
            Classify the following document into one of these categories:
            - INVOICE
            - CONTRACT
            - RESUME
            - LEGAL_DOCUMENT
            - FINANCIAL_REPORT
            - TECHNICAL_MANUAL
            - BUSINESS_CORRESPONDENCE
            - RESEARCH_PAPER
            - OTHER
            
            Return only the category name.
            
            Document text: %s
            """.formatted(text.substring(0, Math.min(text.length(), 2000)));
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o");
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("max_tokens", 50);
            requestBody.put("temperature", 0.1);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                String result = responseJson.path("choices").get(0).path("message").path("content").asText().trim();
                logger.info("Document classified as: {}", result);
                return result;
            } else {
                logger.error("OpenAI classification failed with status: {}", response.getStatusCode());
                return "OTHER";
            }
            
        } catch (Exception e) {
            logger.error("Error classifying document", e);
            return "OTHER";
        }
    }
    
    public String summarizeDocument(String text) {
        logger.info("Summarizing document with OpenAI");
        
        String prompt = """
            Provide a concise summary of the following document in 2-3 sentences.
            Focus on the key points and main topics.
            
            Document text: %s
            """.formatted(text);
        
        return analyzeDocument(text, "summarization");
    }
    
    public Map<String, Object> analyzeSentiment(String text) {
        logger.info("Analyzing sentiment with OpenAI");
        
        String prompt = """
            Analyze the sentiment of the following text and return the result in JSON format:
            {
                "sentiment": "POSITIVE|NEGATIVE|NEUTRAL",
                "confidence": 0.95,
                "scores": {
                    "positive": 0.8,
                    "negative": 0.1,
                    "neutral": 0.1
                }
            }
            
            Text: %s
            """.formatted(text);
        
        try {
            String response = analyzeDocument(text, "sentiment_analysis");
            return objectMapper.readValue(response, Map.class);
        } catch (Exception e) {
            logger.error("Error analyzing sentiment", e);
            return Map.of(
                "sentiment", "NEUTRAL",
                "confidence", 0.5,
                "scores", Map.of("positive", 0.33, "negative", 0.33, "neutral", 0.34)
            );
        }
    }
    
    private String buildPrompt(String text, String analysisType) {
        return switch (analysisType) {
            case "entity_extraction" -> "Extract named entities from this text: " + text;
            case "classification" -> "Classify this document: " + text;
            case "summarization" -> "Summarize this document: " + text;
            case "sentiment_analysis" -> "Analyze the sentiment of this text: " + text;
            default -> "Analyze this document: " + text;
        };
    }
}