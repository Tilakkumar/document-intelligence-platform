package com.docai.services;

import com.docai.models.Document;
import com.docai.repositories.DocumentRepository;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DocumentService {
    
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private StorageService storageService;
    
    @Value("${document.storage.path:/tmp/documents}")
    private String storagePath;
    
    private final Tika tika = new Tika();
    
    public Document uploadDocument(MultipartFile file, String uploadedBy) throws IOException {
        logger.info("Uploading document: {}", file.getOriginalFilename());
        
        // Generate unique filename
        String filename = generateUniqueFilename(file.getOriginalFilename());
        
        // Store file
        String filePath = storageService.storeFile(file, filename);
        
        // Create document entity
        Document document = new Document(
            filename,
            file.getContentType(),
            file.getSize(),
            filePath
        );
        
        document.setOriginalFilename(file.getOriginalFilename());
        document.setUploadedBy(uploadedBy);
        document.setChecksum(calculateChecksum(file.getBytes()));
        document.setProcessingStatus("UPLOADED");
        
        // Save to database
        Document savedDocument = documentRepository.save(document);
        
        // Start async processing
        processDocumentAsync(savedDocument);
        
        logger.info("Document uploaded successfully: {}", savedDocument.getId());
        return savedDocument;
    }
    
    public Optional<Document> getDocumentById(String id) {
        return documentRepository.findById(id);
    }
    
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
    
    public List<Document> getDocumentsByUploadedBy(String uploadedBy) {
        return documentRepository.findByUploadedBy(uploadedBy);
    }
    
    public List<Document> getDocumentsByContentType(String contentType) {
        return documentRepository.findByContentType(contentType);
    }
    
    public List<Document> getDocumentsByClassification(String classification) {
        return documentRepository.findByClassification(classification);
    }
    
    public List<Document> searchDocuments(String searchTerm) {
        return documentRepository.findByExtractedTextContaining(searchTerm);
    }
    
    public List<Document> getUnprocessedDocuments() {
        return documentRepository.findByProcessed(false);
    }
    
    public Document updateDocument(Document document) {
        document.setUpdatedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }
    
    public void deleteDocument(String id) {
        Optional<Document> document = documentRepository.findById(id);
        if (document.isPresent()) {
            // Delete physical file
            storageService.deleteFile(document.get().getFilePath());
            // Delete from database
            documentRepository.deleteById(id);
            logger.info("Document deleted: {}", id);
        }
    }
    
    public String extractText(String filePath) throws IOException, TikaException {
        logger.info("Extracting text from: {}", filePath);
        
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("File not found: " + filePath);
        }
        
        String extractedText = tika.parseToString(file);
        logger.info("Text extracted successfully, length: {}", extractedText.length());
        
        return extractedText;
    }
    
    public void processDocument(Document document) {
        logger.info("Processing document: {}", document.getId());
        
        try {
            document.setProcessingStatus("PROCESSING");
            document = documentRepository.save(document);
            
            // Extract text
            String extractedText = extractText(document.getFilePath());
            document.setExtractedText(extractedText);
            
            // Detect language
            String language = detectLanguage(extractedText);
            document.setLanguage(language);
            
            // Count pages (simplified)
            int pageCount = estimatePageCount(extractedText);
            document.setPageCount(pageCount);
            
            // Mark as processed
            document.setProcessed(true);
            document.setProcessingStatus("COMPLETED");
            
            documentRepository.save(document);
            
            logger.info("Document processed successfully: {}", document.getId());
            
        } catch (Exception e) {
            logger.error("Error processing document: {}", document.getId(), e);
            document.setProcessingStatus("FAILED");
            document.setProcessed(false);
            documentRepository.save(document);
        }
    }
    
    private void processDocumentAsync(Document document) {
        // In a real implementation, this would use @Async or a message queue
        new Thread(() -> processDocument(document)).start();
    }
    
    private String generateUniqueFilename(String originalFilename) {
        String extension = "";
        int lastDot = originalFilename.lastIndexOf('.');
        if (lastDot > 0) {
            extension = originalFilename.substring(lastDot);
        }
        return UUID.randomUUID().toString() + extension;
    }
    
    private String calculateChecksum(byte[] data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(data);
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("Error calculating checksum", e);
            return null;
        }
    }
    
    private String detectLanguage(String text) {
        // Simplified language detection
        if (text.toLowerCase().contains("the") || text.toLowerCase().contains("and")) {
            return "en";
        }
        return "unknown";
    }
    
    private int estimatePageCount(String text) {
        // Simplified page count estimation (500 words per page)
        String[] words = text.split("\\s+");
        return Math.max(1, (int) Math.ceil(words.length / 500.0));
    }
}