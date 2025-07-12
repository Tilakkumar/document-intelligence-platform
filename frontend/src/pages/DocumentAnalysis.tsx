import React, { useState, useEffect } from 'react';
import { Search, FileText, Tag, TrendingUp, Clock, Download } from 'lucide-react';
import { getDocuments, getDocument, analyzeDocument, getDocumentEntities, getSentimentAnalysis } from '../services/api';

interface Document {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadDate: string;
  processingStatus: string;
  entities?: any[];
  sentiment?: any;
  classification?: any;
}

const DocumentAnalysis: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.content || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      // Mock data for demo
      setDocuments([
        {
          id: '1',
          filename: 'annual_report_2023.pdf',
          contentType: 'application/pdf',
          size: 2048000,
          uploadDate: '2024-01-15T10:30:00Z',
          processingStatus: 'COMPLETED',
        },
        {
          id: '2',
          filename: 'contract_agreement.docx',
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1024000,
          uploadDate: '2024-01-14T14:20:00Z',
          processingStatus: 'COMPLETED',
        },
        {
          id: '3',
          filename: 'meeting_notes.txt',
          contentType: 'text/plain',
          size: 15360,
          uploadDate: '2024-01-13T09:45:00Z',
          processingStatus: 'PROCESSING',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeDocument = async (documentId: string) => {
    setAnalyzing(true);
    try {
      const [analysisResult, entities, sentiment] = await Promise.all([
        analyzeDocument(documentId),
        getDocumentEntities(documentId),
        getSentimentAnalysis(documentId),
      ]);

      const document = documents.find(d => d.id === documentId);
      if (document) {
        const updatedDocument = {
          ...document,
          entities: entities || [],
          sentiment: sentiment || {},
          classification: analysisResult || {},
        };
        setSelectedDocument(updatedDocument);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Mock analysis results for demo
      const mockAnalysis = {
        entities: [
          { type: 'PERSON', text: 'John Doe', confidence: 0.95 },
          { type: 'ORGANIZATION', text: 'TechCorp Inc.', confidence: 0.89 },
          { type: 'DATE', text: '2023-12-31', confidence: 0.92 },
          { type: 'MONEY', text: '$1,250,000', confidence: 0.88 },
        ],
        sentiment: {
          overall: 'POSITIVE',
          confidence: 0.76,
          scores: { positive: 0.76, negative: 0.12, neutral: 0.12 },
        },
        classification: {
          category: 'Financial Document',
          confidence: 0.91,
          tags: ['contract', 'financial', 'legal'],
        },
      };

      const document = documents.find(d => d.id === documentId);
      if (document) {
        setSelectedDocument({
          ...document,
          ...mockAnalysis,
        });
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Analysis</h2>
        <p className="text-gray-600">
          Analyze documents to extract entities, sentiment, and classification
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className={`p-4 border border-gray-200 rounded-lg cursor-pointer transition-colors ${
                    selectedDocument?.id === document.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{document.filename}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(document.size)} • {new Date(document.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.processingStatus)}`}>
                        {document.processingStatus}
                      </span>
                      {document.processingStatus === 'COMPLETED' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyzeDocument(document.id);
                          }}
                          disabled={analyzing}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {analyzing ? 'Analyzing...' : 'Analyze'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
          
          {selectedDocument ? (
            <div className="space-y-6">
              {/* Document Info */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedDocument.filename}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Size:</span>
                    <span className="ml-2 text-gray-900">{formatFileSize(selectedDocument.size)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 text-gray-900">{selectedDocument.contentType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Uploaded:</span>
                    <span className="ml-2 text-gray-900">{new Date(selectedDocument.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedDocument.processingStatus)}`}>
                      {selectedDocument.processingStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Entities */}
              {selectedDocument.entities && selectedDocument.entities.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Entities ({selectedDocument.entities.length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedDocument.entities.map((entity, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{entity.text}</span>
                          <span className="ml-2 text-sm text-gray-600">({entity.type})</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {Math.round(entity.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              {selectedDocument.sentiment && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Sentiment Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Overall Sentiment</span>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        selectedDocument.sentiment.overall === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                        selectedDocument.sentiment.overall === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedDocument.sentiment.overall}
                      </span>
                    </div>
                    
                    {selectedDocument.sentiment.scores && (
                      <div className="space-y-2">
                        {Object.entries(selectedDocument.sentiment.scores).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">{key}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(value as number) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500">
                                {Math.round((value as number) * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Classification */}
              {selectedDocument.classification && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Classification
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">Category</span>
                      <span className="text-gray-600">{selectedDocument.classification.category}</span>
                    </div>
                    
                    {selectedDocument.classification.tags && (
                      <div>
                        <span className="text-sm text-gray-600 mb-2 block">Tags</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedDocument.classification.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleAnalyzeDocument(selectedDocument.id)}
                  disabled={analyzing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>{analyzing ? 'Analyzing...' : 'Re-analyze'}</span>
                </button>
                
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a document to view analysis results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;