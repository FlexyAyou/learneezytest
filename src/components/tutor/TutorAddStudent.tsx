
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  parentEmail: string;
  phone: string;
  notes: string;
}

export const TutorAddStudent = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<StudentFormData>();

  const levels = [
    { value: 'cp', label: 'CP' },
    { value: 'ce1', label: 'CE1' },
    { value: 'ce2', label: 'CE2' },
    { value: 'cm1', label: 'CM1' },
    { value: 'cm2', label: 'CM2' },
    { value: '6eme', label: '6ème' },
    { value: '5eme', label: '5ème' },
    { value: '4eme', label: '4ème' },
    { value: '3eme', label: '3ème' },
    { value: '2nde', label: '2nde' },
    { value: '1ere', label: '1ère' },
    { value: 'terminale', label: 'Terminale' }
  ];

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    return password;
  };

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    
    try {
      const tempPassword = generatePassword();
      
      // Simulation de l'ajout d'un élève
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Élève ajouté avec succès",
        description: `${data.firstName} ${data.lastName} a été ajouté. Mot de passe temporaire : ${tempPassword}`,
      });

      // Envoyer les informations par email (simulation)
      console.log('Envoi des informations de connexion à:', data.email);
      console.log('Email parent:', data.parentEmail);
      console.log('Mot de passe temporaire:', tempPassword);

      reset();
      setGeneratedPassword('');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'élève. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Ajouter un élève</h2>
          <p className="text-gray-600">Créer un nouveau compte élève</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Informations de l'élève
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName', { required: 'Le prénom est requis' })}
                      className="mt-1"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName', { required: 'Le nom est requis' })}
                      className="mt-1"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email élève *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Niveau scolaire *</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="06 12 34 56 78"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="parentEmail">Email parent/tuteur *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    {...register('parentEmail', { 
                      required: 'L\'email du parent est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    className="mt-1"
                    placeholder="Email pour les notifications"
                  />
                  {errors.parentEmail && (
                    <p className="text-sm text-red-600 mt-1">{errors.parentEmail.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    placeholder="Notes ou commentaires sur l'élève..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => reset()}>
                    Réinitialiser
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Ajout en cours...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Ajouter l'élève
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Information importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Mot de passe temporaire</h4>
                <p className="text-sm text-blue-700">
                  Un mot de passe temporaire sera généré automatiquement et envoyé par email à l'élève et au parent.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Première connexion</h4>
                <p className="text-sm text-yellow-700">
                  L'élève devra changer son mot de passe lors de sa première connexion.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Notifications</h4>
                <p className="text-sm text-green-700">
                  Le parent recevra les notifications importantes concernant les progrès de l'élève.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
