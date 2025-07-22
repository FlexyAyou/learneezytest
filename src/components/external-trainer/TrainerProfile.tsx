import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Award, Briefcase, Upload, Plus, X, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TrainerProfile = () => {
  const { toast } = useToast();
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    bio: 'Développeur Full-Stack avec plus de 8 ans d\'expérience dans les technologies web modernes. Passionné par l\'enseignement et le partage de connaissances, j\'ai formé plus de 150 étudiants dans divers domaines du développement web.',
    avatar: '',
    hourlyRate: 45,
    languages: ['Français', 'Anglais', 'Espagnol'],
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    timeZone: 'Europe/Paris'
  });

  const [certifications, setCertifications] = useState([
    {
      id: 1,
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2023-06-15',
      credentialId: 'AWS-CD-123456',
      url: 'https://aws.amazon.com/certification/'
    },
    {
      id: 2,
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: '2023-03-20',
      credentialId: 'META-REACT-789',
      url: 'https://developers.facebook.com/certification/'
    },
    {
      id: 3,
      name: 'Google UX Design Certificate',
      issuer: 'Google',
      date: '2022-11-10',
      credentialId: 'GOOGLE-UX-456',
      url: 'https://grow.google/certificates/ux-design/'
    }
  ]);

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp',
      startDate: '2020-01-01',
      endDate: '2023-12-31',
      current: false,
      description: 'Développement d\'applications web complexes avec React, Node.js et AWS. Formation d\'équipes junior et mentoring.'
    },
    {
      id: 2,
      title: 'Lead Frontend Developer',
      company: 'StartupXYZ',
      startDate: '2018-03-01',
      endDate: '2019-12-31',
      current: false,
      description: 'Direction de l\'équipe frontend, architecture des applications React, mise en place des bonnes pratiques.'
    },
    {
      id: 3,
      title: 'Formateur Indépendant',
      company: 'Freelance',
      startDate: '2021-01-01',
      endDate: null,
      current: true,
      description: 'Formation en développement web pour entreprises et particuliers. Spécialisé en React, JavaScript, et UI/UX.'
    }
  ]);

  const [newCertification, setNewCertification] = useState({
    name: '',
    issuer: '',
    date: '',
    credentialId: '',
    url: ''
  });

  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès",
    });
    setIsEditingBasic(false);
    setIsEditingBio(false);
  };

  const handleAddCertification = () => {
    if (!newCertification.name || !newCertification.issuer) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...certifications.map(c => c.id)) + 1;
    setCertifications([...certifications, { id: newId, ...newCertification }]);
    
    setNewCertification({ name: '', issuer: '', date: '', credentialId: '', url: '' });
    setIsAddingCertification(false);
    
    toast({
      title: "Certification ajoutée",
      description: "La certification a été ajoutée à votre profil",
    });
  };

  const handleAddExperience = () => {
    if (!newExperience.title || !newExperience.company || !newExperience.startDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...experiences.map(e => e.id)) + 1;
    setExperiences([...experiences, { id: newId, ...newExperience }]);
    
    setNewExperience({
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setIsAddingExperience(false);
    
    toast({
      title: "Expérience ajoutée",
      description: "L'expérience a été ajoutée à votre profil",
    });
  };

  const removeCertification = (id: number) => {
    setCertifications(certifications.filter(c => c.id !== id));
    toast({
      title: "Certification supprimée",
      description: "La certification a été retirée de votre profil",
    });
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(e => e.id !== id));
    toast({
      title: "Expérience supprimée",
      description: "L'expérience a été retirée de votre profil",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon Profil Formateur</h1>
        <p className="text-muted-foreground">Gérez vos informations professionnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photo et informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profil
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsEditingBasic(!isEditingBasic)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Changer la photo
              </Button>
            </div>

            {isEditingBasic ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Tarif horaire moyen (€)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({...profile, hourlyRate: Number(e.target.value)})}
                  />
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {profile.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {profile.phone}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {profile.location}
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">Tarif moyen</p>
                  <p className="font-semibold">{profile.hourlyRate}€/heure</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Langues et disponibilités */}
        <Card>
          <CardHeader>
            <CardTitle>Langues & Disponibilités</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Langues parlées</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary">{lang}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Jours disponibles</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.availableDays.map((day, index) => (
                  <Badge key={index} variant="outline">{day}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Fuseau horaire</Label>
              <p className="text-sm text-muted-foreground">{profile.timeZone}</p>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">4.9</p>
              <p className="text-sm text-muted-foreground">Note moyenne</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Sessions données</p>
              </div>
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Taux de satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biographie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Biographie</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsEditingBio(!isEditingBio)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            Présentez-vous à vos futurs élèves
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditingBio ? (
            <div className="space-y-3">
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={5}
                placeholder="Décrivez votre parcours, vos spécialités et votre approche pédagogique..."
              />
              <Button onClick={handleSaveProfile}>
                Sauvegarder
              </Button>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          )}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Certifications
            </span>
            <Dialog open={isAddingCertification} onOpenChange={setIsAddingCertification}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une certification</DialogTitle>
                  <DialogDescription>
                    Ajoutez une certification professionnelle à votre profil
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cert-name">Nom de la certification *</Label>
                    <Input
                      id="cert-name"
                      value={newCertification.name}
                      onChange={(e) => setNewCertification({...newCertification, name: e.target.value})}
                      placeholder="Ex: AWS Certified Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cert-issuer">Organisme *</Label>
                    <Input
                      id="cert-issuer"
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification({...newCertification, issuer: e.target.value})}
                      placeholder="Ex: Amazon Web Services"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cert-date">Date d'obtention</Label>
                    <Input
                      id="cert-date"
                      type="date"
                      value={newCertification.date}
                      onChange={(e) => setNewCertification({...newCertification, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cert-id">ID de certification</Label>
                    <Input
                      id="cert-id"
                      value={newCertification.credentialId}
                      onChange={(e) => setNewCertification({...newCertification, credentialId: e.target.value})}
                      placeholder="Ex: AWS-CD-123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cert-url">URL de vérification</Label>
                    <Input
                      id="cert-url"
                      value={newCertification.url}
                      onChange={(e) => setNewCertification({...newCertification, url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingCertification(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddCertification}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(cert.date)}
                    {cert.credentialId && ` • ID: ${cert.credentialId}`}
                  </p>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Vérifier la certification
                    </a>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => removeCertification(cert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expériences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Expériences
            </span>
            <Dialog open={isAddingExperience} onOpenChange={setIsAddingExperience}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une expérience</DialogTitle>
                  <DialogDescription>
                    Ajoutez une expérience professionnelle à votre profil
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="exp-title">Titre du poste *</Label>
                    <Input
                      id="exp-title"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                      placeholder="Ex: Senior Developer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exp-company">Entreprise *</Label>
                    <Input
                      id="exp-company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                      placeholder="Ex: TechCorp"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exp-start">Date de début *</Label>
                      <Input
                        id="exp-start"
                        type="date"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exp-end">Date de fin</Label>
                      <Input
                        id="exp-end"
                        type="date"
                        value={newExperience.endDate || ''}
                        onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                        disabled={newExperience.current}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="exp-current"
                      checked={newExperience.current}
                      onChange={(e) => setNewExperience({...newExperience, current: e.target.checked, endDate: e.target.checked ? '' : newExperience.endDate})}
                    />
                    <Label htmlFor="exp-current">Poste actuel</Label>
                  </div>
                  <div>
                    <Label htmlFor="exp-desc">Description</Label>
                    <Textarea
                      id="exp-desc"
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                      rows={3}
                      placeholder="Décrivez vos responsabilités et réalisations..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingExperience(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddExperience}>
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex justify-between items-start p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-sm font-medium text-blue-600">{exp.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate || '')}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => removeExperience(exp.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerProfile;