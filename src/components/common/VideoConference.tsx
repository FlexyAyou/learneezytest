
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  MessageSquare,
  Settings,
  Share,
  Monitor,
  Camera,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Hand,
  Clock,
  ChevronRight,
  ChevronLeft,
  Grid3x3,
  User,
  Crown,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'presenter' | 'participant';
  isVideoOn: boolean;
  isAudioOn: boolean;
  isHandRaised: boolean;
  isPresenting: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor';
}

interface VideoConferenceProps {
  className?: string;
  meetingId?: string;
  isHost?: boolean;
  participants?: Participant[];
  onLeave?: () => void;
}

const VideoConference: React.FC<VideoConferenceProps> = ({
  className,
  meetingId = "MTG-001",
  isHost = false,
  participants = [],
  onLeave
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'speaker' | 'presentation'>('grid');
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [networkQuality, setNetworkQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const { toast } = useToast();

  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      role: 'host',
      isVideoOn: true,
      isAudioOn: true,
      isHandRaised: false,
      isPresenting: false,
      connectionQuality: 'excellent'
    },
    {
      id: '2',
      name: 'Pierre Martin',
      role: 'participant',
      isVideoOn: false,
      isAudioOn: true,
      isHandRaised: true,
      isPresenting: false,
      connectionQuality: 'good'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      role: 'presenter',
      isVideoOn: true,
      isAudioOn: true,
      isHandRaised: false,
      isPresenting: true,
      connectionQuality: 'good'
    },
    {
      id: '4',
      name: 'Jean Dupont',
      role: 'participant',
      isVideoOn: true,
      isAudioOn: false,
      isHandRaised: false,
      isPresenting: false,
      connectionQuality: 'poor'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMeetingDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast({
      title: isVideoOn ? "Caméra désactivée" : "Caméra activée",
      description: `Votre caméra est maintenant ${isVideoOn ? 'éteinte' : 'allumée'}`,
    });
  };

  const handleToggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    toast({
      title: isAudioOn ? "Microphone désactivé" : "Microphone activé",
      description: `Votre microphone est maintenant ${isAudioOn ? 'éteint' : 'allumé'}`,
    });
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    toast({
      title: isHandRaised ? "Main baissée" : "Main levée",
      description: isHandRaised ? "Votre main a été baissée" : "Votre main est levée",
    });
  };

  const handleStartPresentation = () => {
    setIsPresenting(!isPresenting);
    setViewMode('presentation');
    toast({
      title: isPresenting ? "Présentation arrêtée" : "Présentation démarrée",
      description: isPresenting ? "Votre présentation est terminée" : "Vous présentez maintenant",
    });
  };

  const handleLeaveCall = () => {
    toast({
      title: "Appel terminé",
      description: "Vous avez quitté la réunion",
    });
    onLeave?.();
  };

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'host': return <Crown className="h-3 w-3" />;
      case 'presenter': return <Zap className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className={cn("h-screen bg-gray-900 text-white overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">En direct</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{formatDuration(meetingDuration)}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center space-x-2">
            <span className="text-sm">ID: {meetingId}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <div className={cn("w-2 h-2 rounded-full", getConnectionQualityColor(networkQuality))} />
            <span className="text-xs capitalize">{networkQuality}</span>
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'speaker' : 'grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 h-full">
        {/* Video Area */}
        <div className="flex-1 relative">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-4 p-4 h-full">
              {mockParticipants.map((participant) => (
                <Card key={participant.id} className="bg-gray-800 border-gray-700 relative group overflow-hidden">
                  <CardContent className="p-0 h-full">
                    <div className="relative h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      {participant.isVideoOn ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-white text-gray-800 text-xl">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-gray-600 text-white text-xl">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <VideoOff className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Participant Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(participant.role)}
                            <span className="text-sm font-medium">{participant.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {participant.isHandRaised && (
                              <Hand className="h-4 w-4 text-yellow-500 animate-bounce" />
                            )}
                            {participant.isPresenting && (
                              <Monitor className="h-4 w-4 text-green-500" />
                            )}
                            {!participant.isAudioOn && (
                              <MicOff className="h-4 w-4 text-red-500" />
                            )}
                            <div className={cn("w-2 h-2 rounded-full", getConnectionQualityColor(participant.connectionQuality))} />
                          </div>
                        </div>
                      </div>

                      {/* Speaking Indicator */}
                      {participant.isAudioOn && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-4 h-full">
              <Card className="bg-gray-800 border-gray-700 h-full">
                <CardContent className="p-0 h-full">
                  <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center">
                      <Avatar className="h-32 w-32 mx-auto mb-4">
                        <AvatarFallback className="bg-white text-gray-800 text-4xl">
                          {mockParticipants[0]?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-2xl font-bold">{mockParticipants[0]?.name}</h3>
                      <p className="text-blue-100 capitalize">{mockParticipants[0]?.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className={cn(
          "bg-gray-800 transition-all duration-300 border-l border-gray-700",
          (isChatOpen || isParticipantsOpen) ? "w-80" : "w-0"
        )}>
          {isChatOpen && (
            <div className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Chat disponible pendant la réunion</div>
              </div>
            </div>
          )}

          {isParticipantsOpen && (
            <div className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Participants ({mockParticipants.length})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsParticipantsOpen(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {mockParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-600 text-xs">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(participant.role)}
                          <span className="text-sm font-medium">{participant.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <div className={cn("w-2 h-2 rounded-full", getConnectionQualityColor(participant.connectionQuality))} />
                          <span>{participant.connectionQuality}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {participant.isHandRaised && (
                        <Hand className="h-3 w-3 text-yellow-500" />
                      )}
                      {!participant.isAudioOn && (
                        <MicOff className="h-3 w-3 text-red-500" />
                      )}
                      {!participant.isVideoOn && (
                        <VideoOff className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Button
            variant={isAudioOn ? "default" : "destructive"}
            size="sm"
            onClick={handleToggleAudio}
            className="h-10 w-10 rounded-full"
          >
            {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={isVideoOn ? "default" : "destructive"}
            size="sm"
            onClick={handleToggleVideo}
            className="h-10 w-10 rounded-full"
          >
            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRaiseHand}
            className={cn(
              "h-10 w-10 rounded-full",
              isHandRaised && "bg-yellow-500 text-white"
            )}
          >
            <Hand className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartPresentation}
            className={cn(
              "h-10 w-10 rounded-full",
              isPresenting && "bg-green-500 text-white"
            )}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="h-10 w-10 rounded-full"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            className="h-10 w-10 rounded-full"
          >
            <Users className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 rounded-full"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLeaveCall}
            className="h-10 w-10 rounded-full"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoConference;
