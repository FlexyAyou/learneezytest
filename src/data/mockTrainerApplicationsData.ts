
import { TrainerApplication, TrainerDocument } from '@/types/trainer-application';

export const mockTrainerApplications: TrainerApplication[] = [
  {
    id: '1',
    userId: 'user-1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    bio: 'Développeur Full-Stack avec plus de 5 ans d\'expérience dans les technologies web modernes. Passionné par l\'enseignement et le partage de connaissances. J\'ai formé plus de 100 développeurs junior dans ma carrière.',
    experienceYears: 5,
    hourlyRate: 45,
    specialties: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'MongoDB'],
    languages: ['Français', 'Anglais'],
    status: 'pending',
    submittedAt: '2024-01-15T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '2',
    userId: 'user-2',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@email.com',
    phone: '+33 6 98 76 54 32',
    location: 'Lyon, France',
    bio: 'Designer UX/UI passionnée avec une expertise en Figma et Adobe Creative Suite. J\'ai travaillé avec des startups et des grandes entreprises pour créer des expériences utilisateur exceptionnelles.',
    experienceYears: 7,
    hourlyRate: 50,
    specialties: ['UX/UI Design', 'Figma', 'Adobe XD', 'Design Thinking', 'Prototypage'],
    languages: ['Français', 'Anglais', 'Espagnol'],
    status: 'pending',
    submittedAt: '2024-01-20T14:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '3',
    userId: 'user-3',
    firstName: 'Pierre',
    lastName: 'Durand',
    email: 'pierre.durand@email.com',
    phone: '+33 6 45 67 89 01',
    location: 'Marseille, France',
    bio: 'Expert en marketing digital avec 10 ans d\'expérience. Spécialisé dans le SEO, Google Ads et les stratégies de croissance. J\'ai aidé plus de 50 entreprises à doubler leur trafic web.',
    experienceYears: 10,
    hourlyRate: 60,
    specialties: ['Marketing Digital', 'SEO', 'Google Ads', 'Analytics', 'Growth Hacking'],
    languages: ['Français', 'Anglais'],
    status: 'approved',
    submittedAt: '2022-11-10T09:15:00Z',
    reviewedAt: '2022-11-12T16:20:00Z',
    reviewedBy: 'admin-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '4',
    userId: 'user-4',
    firstName: 'Sophie',
    lastName: 'Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+33 6 23 45 67 89',
    location: 'Toulouse, France',
    bio: 'Data Scientist avec une expertise en Machine Learning et Python. Docteur en statistiques, j\'ai publié plusieurs articles de recherche et je forme régulièrement des équipes d\'entreprise.',
    experienceYears: 8,
    hourlyRate: 65,
    specialties: ['Python', 'Data Science', 'Machine Learning', 'Statistics', 'TensorFlow'],
    languages: ['Français', 'Anglais'],
    status: 'rejected',
    adminNotes: 'Manque de certifications récentes en IA',
    submittedAt: '2023-06-05T11:45:00Z',
    reviewedAt: '2023-06-10T14:30:00Z',
    reviewedBy: 'admin-1',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
];

export const mockTrainerDocuments: TrainerDocument[] = [
  // Documents pour Jean Dupont
  {
    id: 'doc-1',
    trainerApplicationId: '1',
    documentType: 'diploma',
    documentName: 'Diplôme Master Informatique - Université Paris-Saclay',
    documentUrl: '/documents/diplome-master-info.pdf',
    isVerified: false,
    uploadedAt: '2024-01-15T10:05:00Z'
  },
  {
    id: 'doc-2',
    trainerApplicationId: '1',
    documentType: 'certification',
    documentName: 'AWS Certified Developer Associate',
    documentUrl: '/documents/aws-certification.pdf',
    isVerified: false,
    uploadedAt: '2024-01-15T10:10:00Z'
  },
  {
    id: 'doc-3',
    trainerApplicationId: '1',
    documentType: 'certification',
    documentName: 'React Professional Certification',
    documentUrl: '/documents/react-certification.pdf',
    isVerified: false,
    uploadedAt: '2024-01-15T10:15:00Z'
  },
  {
    id: 'doc-4',
    trainerApplicationId: '1',
    documentType: 'cv',
    documentName: 'CV Jean Dupont 2024',
    documentUrl: '/documents/cv-jean-dupont.pdf',
    isVerified: false,
    uploadedAt: '2024-01-15T10:20:00Z'
  },
  // Documents pour Marie Martin
  {
    id: 'doc-5',
    trainerApplicationId: '2',
    documentType: 'diploma',
    documentName: 'Diplôme École de Design - ENSAD Paris',
    documentUrl: '/documents/diplome-design.pdf',
    isVerified: false,
    uploadedAt: '2024-01-20T14:35:00Z'
  },
  {
    id: 'doc-6',
    trainerApplicationId: '2',
    documentType: 'certification',
    documentName: 'Adobe Certified Expert - XD',
    documentUrl: '/documents/adobe-certification.pdf',
    isVerified: false,
    uploadedAt: '2024-01-20T14:40:00Z'
  },
  {
    id: 'doc-7',
    trainerApplicationId: '2',
    documentType: 'certification',
    documentName: 'Google UX Design Certificate',
    documentUrl: '/documents/google-ux-certification.pdf',
    isVerified: false,
    uploadedAt: '2024-01-20T14:45:00Z'
  },
  // Documents pour Pierre Durand (approuvé)
  {
    id: 'doc-8',
    trainerApplicationId: '3',
    documentType: 'diploma',
    documentName: 'Master Marketing Digital - HEC Paris',
    documentUrl: '/documents/master-marketing.pdf',
    isVerified: true,
    uploadedAt: '2022-11-10T09:20:00Z'
  },
  {
    id: 'doc-9',
    trainerApplicationId: '3',
    documentType: 'certification',
    documentName: 'Google Ads Certified Professional',
    documentUrl: '/documents/google-ads-certification.pdf',
    isVerified: true,
    uploadedAt: '2022-11-10T09:25:00Z'
  },
  // Documents pour Sophie Laurent (rejeté)
  {
    id: 'doc-10',
    trainerApplicationId: '4',
    documentType: 'diploma',
    documentName: 'Doctorat Statistiques - Sorbonne',
    documentUrl: '/documents/doctorat-stats.pdf',
    isVerified: true,
    uploadedAt: '2023-06-05T11:50:00Z'
  }
];
