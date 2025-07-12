package com.docai.repositories;

import com.docai.models.DocumentAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalyticsRepository extends MongoRepository<DocumentAnalysis, String> {
    
    @Query("{ 'documentId': ?0 }")
    List<DocumentAnalysis> findByDocumentId(String documentId);
    
    @Query("{ 'analysisType': ?0 }")
    List<DocumentAnalysis> findByAnalysisType(String analysisType);
    
    @Query("{ 'confidence': { $gte: ?0 } }")
    List<DocumentAnalysis> findByConfidenceGreaterThanEqual(Double confidence);
    
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    List<DocumentAnalysis> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{ 'processingTime': { $gte: ?0, $lte: ?1 } }")
    List<DocumentAnalysis> findByProcessingTimeBetween(Long minTime, Long maxTime);
    
    @Query("{ 'status': ?0 }")
    List<DocumentAnalysis> findByStatus(String status);
    
    @Query("{ 'entities.type': ?0 }")
    List<DocumentAnalysis> findByEntityType(String entityType);
    
    @Query("{ 'summary': { $regex: ?0, $options: 'i' } }")
    List<DocumentAnalysis> findBySummaryContaining(String searchTerm);
    
    @Query("{ 'documentId': ?0, 'analysisType': ?1 }")
    Optional<DocumentAnalysis> findByDocumentIdAndAnalysisType(String documentId, String analysisType);
}