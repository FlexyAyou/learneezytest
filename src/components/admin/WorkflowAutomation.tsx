
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Pause, Settings, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';

interface WorkflowStep {
  id: string;
  templateId: string;
  delay: number;
  conditions?: any;
}

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  isActive: boolean;
  steps: WorkflowStep[];
  stats: {
    sent: number;
    opened: number;
    clicked: number;
  };
}

interface WorkflowAutomationProps {
  workflows: Workflow[];
  onToggleWorkflow: (id: string) => void;
  onEditWorkflow: (workflow: Workflow) => void;
  onCreateWorkflow: () => void;
}

export const WorkflowAutomation: React.FC<WorkflowAutomationProps> = ({
  workflows,
  onToggleWorkflow,
  onEditWorkflow,
  onCreateWorkflow
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Workflows d'automatisation</h3>
        <Button onClick={onCreateWorkflow}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau workflow
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-medium">{workflow.name}</CardTitle>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {workflow.trigger}
                  </Badge>
                </div>
                <Switch
                  checked={workflow.isActive}
                  onCheckedChange={() => onToggleWorkflow(workflow.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {workflow.steps.length} étape{workflow.steps.length > 1 ? 's' : ''}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-medium">{workflow.stats.sent}</div>
                    <div className="text-xs text-gray-500">Envoyés</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{workflow.stats.opened}</div>
                    <div className="text-xs text-gray-500">Ouverts</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">{workflow.stats.clicked}</div>
                    <div className="text-xs text-gray-500">Cliqués</div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditWorkflow(workflow)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3 mr-1" />
                    Config
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <WorkflowEditor
        workflow={selectedWorkflow}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={(workflow) => {
          onEditWorkflow(workflow);
          setShowEditDialog(false);
        }}
      />
    </div>
  );
};

const WorkflowEditor: React.FC<{
  workflow: Workflow | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (workflow: Workflow) => void;
}> = ({ workflow, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: workflow?.name || '',
    trigger: workflow?.trigger || '',
    steps: workflow?.steps || []
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurer le workflow</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Nom du workflow</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label>Déclencheur</Label>
            <Select value={formData.trigger} onValueChange={(value) => setFormData(prev => ({ ...prev, trigger: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inscription">Inscription</SelectItem>
                <SelectItem value="completion">Fin de formation</SelectItem>
                <SelectItem value="inactivity">Inactivité</SelectItem>
                <SelectItem value="certificate_expiry">Expiration certificat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Étapes du workflow</Label>
            <div className="space-y-2 mt-2">
              {formData.steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2 p-2 border rounded">
                  <span className="text-sm">Étape {index + 1}</span>
                  <Input placeholder="Template" className="flex-1" />
                  <Input placeholder="Délai (h)" className="w-20" type="number" />
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="w-3 h-3 mr-2" />
                Ajouter une étape
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={() => onSave(formData as Workflow)}>Sauvegarder</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
