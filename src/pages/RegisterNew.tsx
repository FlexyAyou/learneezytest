import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, UserPlus, GraduationCap, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useFastAPIAuth } from '@/hooks/useFastAPIAuth';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';

const baseSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
  confirmPassword: z.string(),
  nom: z.string().min(2, { message: "Le nom est requis" }),
  prenom: z.string().min(2, { message: "Le prénom est requis" }),
  telephone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  adresse: z.string().min(5, { message: "Adresse requise" }),
  code_postal: z.string().min(4, { message: "Code postal requis" }),
  ville: z.string().min(2, { message: "Ville requise" }),
  pays: z.string().min(2, { message: "Pays requis" }).default("France"),
  userType: z.enum(['apprenant', 'tuteur', 'formateur']),
  // Apprenant fields
  date_naissance: z.string().optional(),
  niveau_etude: z.string().optional(),
  situation_professionnelle: z.string().optional(),
  objectifs_formation: z.string().optional(),
  is_majeur: z.boolean().optional(),
  // Tuteur fields
  lien_parente: z.string().optional(),
  // Formateur fields
  specialites: z.string().optional(),
  experience_annees: z.string().optional(),
  diplomes: z.string().optional(),
  cv_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  type_formateur: z.enum(['interne', 'independant']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof baseSchema>;

const RegisterNew = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerApprenant, registerTuteur, registerFormateur, isSubmitting } = useFastAPIAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      userType: 'apprenant',
      pays: 'France',
      is_majeur: true,
      type_formateur: 'independant',
    },
  });

  const userType = form.watch('userType');

  const onSubmit = async (data: FormData) => {
    try {
      if (userType === 'apprenant') {
        await registerApprenant({
          email: data.email,
          password: data.password,
          nom: data.nom,
          prenom: data.prenom,
          date_naissance: data.date_naissance!,
          telephone: data.telephone,
          adresse: data.adresse,
          code_postal: data.code_postal,
          ville: data.ville,
          pays: data.pays,
          niveau_etude: data.niveau_etude,
          situation_professionnelle: data.situation_professionnelle,
          objectifs_formation: data.objectifs_formation,
          is_majeur: data.is_majeur || true,
        });
      } else if (userType === 'tuteur') {
        await registerTuteur({
          email: data.email,
          password: data.password,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          adresse: data.adresse,
          code_postal: data.code_postal,
          ville: data.ville,
          pays: data.pays,
          lien_parente: data.lien_parente,
        });
      } else if (userType === 'formateur') {
        const specialites = data.specialites?.split(',').map(s => s.trim()) || [];
        const diplomes = data.diplomes?.split(',').map(d => d.trim()) || [];
        
        await registerFormateur({
          email: data.email,
          password: data.password,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          adresse: data.adresse,
          code_postal: data.code_postal,
          ville: data.ville,
          pays: data.pays,
          specialites: specialites,
          experience_annees: parseInt(data.experience_annees || '0'),
          diplomes: diplomes,
          cv_url: data.cv_url,
          linkedin_url: data.linkedin_url,
          type_formateur: data.type_formateur!,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Créer un compte</h1>
          <p className="text-muted-foreground">Rejoignez LearnEezy et commencez votre parcours</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>Remplissez le formulaire pour créer votre compte</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* User Type Selection */}
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de profil</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre profil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apprenant">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>Apprenant</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="tuteur">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Tuteur</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="formateur">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              <span>Formateur</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="prenom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="0601020304" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Rue de la Paix" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="code_postal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="75001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ville"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays</FormLabel>
                        <FormControl>
                          <Input placeholder="France" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Apprenant specific fields */}
                {userType === 'apprenant' && (
                  <>
                    <FormField
                      control={form.control}
                      name="date_naissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_majeur"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Je suis majeur(e)</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="niveau_etude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Niveau d'études (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Bac+3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="situation_professionnelle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situation professionnelle (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Étudiant, Salarié, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="objectifs_formation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objectifs de formation (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Décrivez vos objectifs..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Tuteur specific fields */}
                {userType === 'tuteur' && (
                  <FormField
                    control={form.control}
                    name="lien_parente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lien de parenté (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Père, Mère, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Formateur specific fields */}
                {userType === 'formateur' && (
                  <>
                    <FormField
                      control={form.control}
                      name="type_formateur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de formateur</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="independant">Indépendant</SelectItem>
                              <SelectItem value="interne">Interne</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialites"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spécialités (séparées par des virgules)</FormLabel>
                          <FormControl>
                            <Input placeholder="Python, React, DevOps" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experience_annees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Années d'expérience</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diplomes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diplômes (séparés par des virgules, optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Master Informatique, Licence Mathématiques" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cv_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL du CV (optionnel)</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://exemple.com/cv.pdf" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL LinkedIn (optionnel)</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://linkedin.com/in/votre-profil" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/connexion" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterNew;
