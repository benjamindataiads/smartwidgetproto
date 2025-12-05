'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName: string;
}

export function SaveModal({ isOpen, onClose, onSave, initialName }: SaveModalProps) {
  const [name, setName] = useState(initialName);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Widget"
      description="Give your widget a name to save it to your library"
    >
      <div className="p-6 space-y-6">
        <Input
          label="Widget Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Widget"
          autoFocus
        />
        
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Widget
          </Button>
        </div>
      </div>
    </Modal>
  );
}

