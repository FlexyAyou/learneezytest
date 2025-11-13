import { AlertCircle, Server, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BackendConnectionErrorProps {
  error?: string;
  onRetry?: () => void;
}

/**
 * Composant pour afficher une erreur de connexion backend avec des instructions de diagnostic
 */
export const BackendConnectionError: React.FC<BackendConnectionErrorProps> = ({ 
  error, 
  onRetry 
}) => {
  const backendUrl = import.meta.env.VITE_API_URL || 'Non configuré';

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-2xl w-full border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <CardTitle className="text-destructive">Connexion au serveur impossible</CardTitle>
          </div>
          <CardDescription>
            Le frontend ne peut pas communiquer avec le backend FastAPI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Détails de l'erreur */}
          {error && (
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm font-mono text-destructive">{error}</p>
            </div>
          )}

          {/* Informations de configuration */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Server className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-semibold text-sm">URL du backend configurée :</p>
                <p className="text-sm font-mono text-muted-foreground">{backendUrl}</p>
              </div>
            </div>
          </div>

          {/* Instructions de diagnostic */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <p className="font-semibold text-sm">🔍 Étapes de diagnostic :</p>
            <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Vérifiez que le serveur backend FastAPI est démarré</li>
              <li>Testez manuellement l'URL : <code className="text-xs bg-background px-1 py-0.5 rounded">{backendUrl}/docs</code></li>
              <li>Vérifiez la configuration CORS du backend pour autoriser le domaine Lovable</li>
              <li>Vérifiez que la variable d'environnement <code className="text-xs bg-background px-1 py-0.5 rounded">VITE_API_URL</code> est correcte dans <code className="text-xs bg-background px-1 py-0.5 rounded">.env</code></li>
              <li>Si le backend est local, utilisez <code className="text-xs bg-background px-1 py-0.5 rounded">ngrok</code> ou similaire pour l'exposer</li>
            </ol>
          </div>

          {/* Configuration CORS exemple */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-semibold text-sm">💡 Configuration CORS backend (FastAPI) :</p>
            <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`}
            </pre>
          </div>

          {/* Bouton retry */}
          {onRetry && (
            <div className="flex justify-center pt-2">
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer la connexion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
