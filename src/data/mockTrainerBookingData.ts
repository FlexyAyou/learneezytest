
import { TrainerBooking, TrainerReview, StudentTrainerNote, TrainerProfile } from '@/types/trainer-booking';

export const mockTrainerBookings: TrainerBooking[] = [
  {
    id: '1',
    studentId: 'student-1',
    trainerId: 'trainer-1',
    trainerName: 'Sophie Martin',
    trainerPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    trainerSpecialty: 'Mathématiques',
    sessionDate: '2024-02-05',
    sessionStartTime: '14:00',
    sessionEndTime: '15:00',
    sessionDuration: 60,
    sessionType: 'online',
    subject: 'Révision des équations du second degré',
    status: 'completed',
    meetingUrl: 'https://meet.google.com/abc-def-ghi',
    meetingId: 'abc-def-ghi',
    price: 35,
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '2',
    studentId: 'student-1',
    trainerId: 'trainer-2',
    trainerName: 'Pierre Dubois',
    trainerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    trainerSpecialty: 'Français',
    sessionDate: '2024-02-07',
    sessionStartTime: '16:30',
    sessionEndTime: '17:30',
    sessionDuration: 60,
    sessionType: 'presential',
    subject: 'Analyse littéraire - Le Rouge et le Noir',
    status: 'scheduled',
    price: 40,
    createdAt: '2024-01-28T14:30:00Z'
  },
  {
    id: '3',
    studentId: 'student-1',
    trainerId: 'trainer-3',
    trainerName: 'Marie Leroy',
    trainerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
    trainerSpecialty: 'Anglais',
    sessionDate: '2024-02-03',
    sessionStartTime: '10:00',
    sessionEndTime: '11:00',
    sessionDuration: 60,
    sessionType: 'online',
    subject: 'Conversation anglaise - Niveau intermédiaire',
    status: 'completed',
    meetingUrl: 'https://zoom.us/j/123456789',
    meetingId: '123-456-789',
    notes: 'Excellente session, très participative',
    price: 30,
    createdAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    studentId: 'student-1',
    trainerId: 'trainer-1',
    trainerName: 'Sophie Martin',
    trainerPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    trainerSpecialty: 'Mathématiques',
    sessionDate: '2024-02-12',
    sessionStartTime: '15:00',
    sessionEndTime: '16:00',
    sessionDuration: 60,
    sessionType: 'online',
    subject: 'Géométrie - Théorème de Pythagore',
    status: 'scheduled',
    meetingUrl: 'https://meet.google.com/xyz-abc-def',
    meetingId: 'xyz-abc-def',
    price: 35,
    createdAt: '2024-02-01T11:20:00Z'
  },
  {
    id: '5',
    studentId: 'student-1',
    trainerId: 'trainer-4',
    trainerName: 'Thomas Bernard',
    trainerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    trainerSpecialty: 'Physique-Chimie',
    sessionDate: '2024-01-28',
    sessionStartTime: '13:30',
    sessionEndTime: '14:30',
    sessionDuration: 60,
    sessionType: 'online',
    subject: 'Les réactions chimiques',
    status: 'no_show',
    meetingUrl: 'https://teams.microsoft.com/l/meetup-join/abc123',
    price: 38,
    createdAt: '2024-01-15T16:45:00Z'
  }
];

export const mockTrainerReviews: TrainerReview[] = [
  {
    id: '1',
    bookingId: '1',
    studentId: 'student-1',
    trainerId: 'trainer-1',
    rating: 5,
    comment: 'Excellente formatrice ! Très pédagogue et patiente. Les explications sont claires et les exercices bien adaptés.',
    isAnonymous: false,
    pedagogyRating: 5,
    communicationRating: 5,
    punctualityRating: 5,
    expertiseRating: 5,
    wouldRecommend: true,
    createdAt: '2024-02-05T16:30:00Z'
  },
  {
    id: '2',
    bookingId: '3',
    studentId: 'student-1',
    trainerId: 'trainer-3',
    rating: 4,
    comment: 'Très bonne session de conversation. Marie est dynamique et encourage vraiment à parler.',
    isAnonymous: true,
    pedagogyRating: 4,
    communicationRating: 5,
    punctualityRating: 4,
    expertiseRating: 4,
    wouldRecommend: true,
    createdAt: '2024-02-03T12:15:00Z'
  }
];

export const mockStudentTrainerNotes: StudentTrainerNote[] = [
  {
    id: '1',
    studentId: 'student-1',
    trainerId: 'trainer-1',
    note: 'Sophie est très patiente avec les mathématiques. Se souvenir de demander plus d\'exercices sur les fractions la prochaine fois.',
    createdAt: '2024-02-05T16:45:00Z',
    updatedAt: '2024-02-05T16:45:00Z'
  },
  {
    id: '2',
    studentId: 'student-1',
    trainerId: 'trainer-3',
    note: 'Marie parle très bien anglais britannique. Idéal pour travailler l\'accent. Demander des ressources pour améliorer la prononciation.',
    createdAt: '2024-02-03T12:30:00Z',
    updatedAt: '2024-02-03T12:30:00Z'
  }
];

export const mockTrainerProfiles: TrainerProfile[] = [
  {
    id: 'trainer-1',
    name: 'Sophie Martin',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face',
    specialty: 'Mathématiques',
    hourlyRate: 35,
    bio: 'Professeure de mathématiques avec 8 ans d\'expérience. Spécialisée dans l\'aide aux élèves en difficulté et la préparation aux examens.',
    averageRating: 4.8,
    totalReviews: 124,
    totalSessions: 8,
    nextAvailableDate: '2024-02-15'
  },
  {
    id: 'trainer-2',
    name: 'Pierre Dubois',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face',
    specialty: 'Français',
    hourlyRate: 40,
    bio: 'Agrégé de lettres modernes, passionné de littérature. Accompagne les élèves dans la découverte des textes et l\'expression écrite.',
    averageRating: 4.6,
    totalReviews: 89,
    totalSessions: 3,
    nextAvailableDate: '2024-02-10'
  },
  {
    id: 'trainer-3',
    name: 'Marie Leroy',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face',
    specialty: 'Anglais',
    hourlyRate: 30,
    bio: 'Native anglophone, certifiée TEFL. Spécialisée dans la conversation et la préparation aux certifications Cambridge.',
    averageRating: 4.9,
    totalReviews: 156,
    totalSessions: 5,
    nextAvailableDate: '2024-02-08'
  },
  {
    id: 'trainer-4',
    name: 'Thomas Bernard',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
    specialty: 'Physique-Chimie',
    hourlyRate: 38,
    bio: 'Docteur en chimie, ancien chercheur. Rend les sciences accessibles à tous avec des expériences pratiques.',
    averageRating: 4.4,
    totalReviews: 67,
    totalSessions: 1,
    nextAvailableDate: '2024-02-20'
  }
];
