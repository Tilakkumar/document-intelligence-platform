package com.docai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableConfigurationProperties
@EnableMongoAuditing
@EnableAsync
public class DocumentIntelligenceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DocumentIntelligenceApplication.class, args);
    }
}