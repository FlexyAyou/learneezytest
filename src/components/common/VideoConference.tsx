
import React, { useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VideoConferenceProps {
  sessionId?: string;
  isHost?: boolean;
}

export const VideoConference = ({ sessionId, isHost = false }: VideoConferenceProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [participants] = useState([
    { id: '1', name: 'Marie Dubois', isHost: true },
    { id: '2', name: 'Jean Martin', isHost: false },
    { id: '3', name: 'Sophie Durand', isHost: false }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Visioconférence
          </div>
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            {participants.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Session ID: {sessionId || 'DEMO-123'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Zone vidéo principale */}
          <div className="bg-gray-900 rounded-lg p-8 text-center text-white">
            <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Zone de visioconférence</p>
            <p className="text-sm opacity-70">Les participants apparaîtront ici</p>
          </div>

          {/* Participants */}
          <div>
            <h4 className="font-medium mb-2">Participants ({participants.length})</h4>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      {participant.name.charAt(0)}
                    </div>
                    <span className="ml-2 text-sm">{participant.name}</span>
                    {participant.isHost && (
                      <Badge variant="outline" className="ml-2 text-xs">Hôte</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={isVideoOn ? "default" : "destructive"}
              size="sm"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button
              variant={isAudioOn ? "default" : "destructive"}
              size="sm"
              onClick={() => setIsAudioOn(!isAudioOn)}
            >
              {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            {isHost && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <Button variant="destructive" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
