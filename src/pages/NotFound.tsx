import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileQuestion, Building2 } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if this is an OF slug error (subdomain or path-based)
  const isOFError = location.state?.isOFError || location.pathname.includes('/organisme');
  const ofSlug = location.state?.slug;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 shadow-2xl border-2 animate-fade-in">
        <div className="text-center space-y-6">
          {/* 404 Animation */}
          <div className="relative">
            <div className="text-[120px] md:text-[180px] font-black text-primary/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              {isOFError ? (
                <Building2 className="w-24 h-24 md:w-32 md:h-32 text-primary animate-pulse" />
              ) : (
                <FileQuestion className="w-24 h-24 md:w-32 md:h-32 text-primary animate-pulse" />
              )}
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {isOFError ? "Organisme introuvable" : "Page introuvable"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {isOFError ? (
                <>
                  L'organisme de formation <span className="font-semibold text-primary">{ofSlug || "demandé"}</span> n'existe pas ou n'est plus disponible.
                </>
              ) : (
                "Oups ! La page que vous recherchez semble avoir disparu dans les méandres du web."
              )}
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <p className="text-sm font-medium text-foreground">
              Que pouvez-vous faire ?
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Vérifiez l'URL pour détecter d'éventuelles erreurs de frappe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Retournez à la page d'accueil et explorez nos formations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Utilisez la barre de recherche pour trouver ce que vous cherchez</span>
              </li>
              {isOFError && (
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Contactez-nous si vous pensez qu'il s'agit d'une erreur</span>
                </li>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Page d'accueil
              </Button>
            </Link>
            
            <Link to="/cours">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                <Search className="w-4 h-4" />
                Nos formations
              </Button>
            </Link>
          </div>

          {/* Footer Help */}
          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Besoin d'aide ?{" "}
              <Link to="/contact" className="text-primary hover:underline font-medium">
                Contactez notre support
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
