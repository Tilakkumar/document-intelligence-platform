package com.docai.repositories;

import com.docai.models.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends MongoRepository<Document, String> {
    
    @Query("{ 'filename': ?0 }")
    Optional<Document> findByFilename(String filename);
    
    @Query("{ 'contentType': ?0 }")
    List<Document> findByContentType(String contentType);
    
    @Query("{ 'classification': ?0 }")
    List<Document> findByClassification(String classification);
    
    @Query("{ 'uploadedBy': ?0 }")
    List<Document> findByUploadedBy(String uploadedBy);
    
    @Query("{ 'processed': ?0 }")
    List<Document> findByProcessed(Boolean processed);
    
    @Query("{ 'entities.type': ?0 }")
    List<Document> findByEntityType(String entityType);
    
    @Query("{ 'tags': { $in: ?0 } }")
    List<Document> findByTagsIn(List<String> tags);
    
    @Query("{ 'extractedText': { $regex: ?0, $options: 'i' } }")
    List<Document> findByExtractedTextContaining(String searchTerm);
    
    @Query("{ 'createdAt': { $gte: ?0, $lte: ?1 } }")
    List<Document> findByCreatedAtBetween(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
    
    @Query("{ 'fileSize': { $gte: ?0, $lte: ?1 } }")
    List<Document> findByFileSizeBetween(Long minSize, Long maxSize);
    
    @Query("{ $text: { $search: ?0 } }")
    List<Document> findByTextSearch(String searchTerm);
}