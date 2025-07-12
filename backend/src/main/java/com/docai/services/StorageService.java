package com.docai.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class StorageService {
    
    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);
    
    @Value("${document.storage.path:/tmp/documents}")
    private String storagePath;
    
    public String storeFile(MultipartFile file, String filename) throws IOException {
        logger.info("Storing file: {}", filename);
        
        // Create directory structure based on current date
        String dateFolder = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        Path targetDir = Paths.get(storagePath, dateFolder);
        
        // Create directories if they don't exist
        Files.createDirectories(targetDir);
        
        // Store file
        Path targetPath = targetDir.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        
        String filePath = targetPath.toString();
        logger.info("File stored successfully: {}", filePath);
        
        return filePath;
    }
    
    public byte[] retrieveFile(String filePath) throws IOException {
        logger.info("Retrieving file: {}", filePath);
        
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new IOException("File not found: " + filePath);
        }
        
        return Files.readAllBytes(path);
    }
    
    public void deleteFile(String filePath) {
        logger.info("Deleting file: {}", filePath);
        
        try {
            Path path = Paths.get(filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                logger.info("File deleted successfully: {}", filePath);
            } else {
                logger.warn("File not found for deletion: {}", filePath);
            }
        } catch (IOException e) {
            logger.error("Error deleting file: {}", filePath, e);
        }
    }
    
    public boolean fileExists(String filePath) {
        return Files.exists(Paths.get(filePath));
    }
    
    public long getFileSize(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new IOException("File not found: " + filePath);
        }
        return Files.size(path);
    }
    
    public String getFileContentType(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new IOException("File not found: " + filePath);
        }
        return Files.probeContentType(path);
    }
    
    public void initializeStorage() {
        try {
            Path storageDir = Paths.get(storagePath);
            if (!Files.exists(storageDir)) {
                Files.createDirectories(storageDir);
                logger.info("Storage directory created: {}", storagePath);
            }
        } catch (IOException e) {
            logger.error("Error initializing storage directory: {}", storagePath, e);
        }
    }
}