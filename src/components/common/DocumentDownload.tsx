
import React from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

interface DocumentDownloadProps {
  documents: Document[];
  userRole: 'student' | 'instructor' | 'admin';
}

export const DocumentDownload = ({ documents, userRole }: DocumentDownloadProps) => {
  const handleDownload = (document: Document) => {
    // Logique de téléchargement
    console.log(`Téléchargement du document: ${document.name}`);
  };

  const getDocumentTitle = () => {
    switch (userRole) {
      case 'student':
        return 'Mes documents';
      case 'instructor':
        return 'Documents de mes élèves';
      case 'admin':
        return 'Tous les documents';
      default:
        return 'Documents';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getDocumentTitle()}</CardTitle>
        <CardDescription>
          Téléchargez vos documents et logs de formation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.type} • {doc.size} • {doc.date}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(doc)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
