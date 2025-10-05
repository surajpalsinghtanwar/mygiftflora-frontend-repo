export type ConsultationType = 'video' | 'phone' | 'in_person' | 'chat';
export type ConsultationStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

export interface Consultation {
  id: string;
  userId: string;
  consultantId: string;
  designRequestId?: string;
  scheduledAt: string;
  duration: number;
  consultationType: ConsultationType;
  status: ConsultationStatus;
  meetingLink?: string;
  meetingId?: string;
  agenda?: any;
  notes?: string;
  summary?: string;
  actionItems?: any;
  rating?: number;
  feedback?: string;
  consultationFee?: number;
  startedAt?: string;
  endedAt?: string;
  logs?: ConsultationLog[];
}

export interface ConsultationLog {
  id: string;
  consultationId: string;
  action: string;
  timestamp: string;
  notes?: string;
  screenshotUrl?: string;
  metadata?: any;
  performedBy: string;
}
