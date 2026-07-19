'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { students, classes } from '@/lib/erp-data';

export type QuickActionType =
  | 'add-student'
  | 'add-teacher'
  | 'add-parent'
  | 'create-announcement'
  | 'add-event'
  | 'record-fee'
  | 'add-visitor'
  | 'collect-fee'
  | 'schedule-appointment'
  | 'assign-homework'
  | 'mark-attendance';

interface QuickActionModalsProps {
  openModal: QuickActionType | null;
  onClose: () => void;
  initialData?: Record<string, string>;
  onTeacherAdded?: (teacher: Record<string, string>) => void;
  onEventAdded?: (event: Record<string, string>) => void;
}

const modalConfig: Record<QuickActionType, { title: string; description: string }> = {
  'add-student': { title: 'Add New Student', description: 'Enter student details to enroll them in the school.' },
  'add-teacher': { title: 'Add New Teacher', description: 'Enter teacher details to add them to the faculty.' },
  'add-parent': { title: 'Add New Parent', description: 'Enter parent details to register them.' },
  'create-announcement': { title: 'Create Announcement', description: 'Send an announcement to selected audience.' },
  'add-event': { title: 'Add New Event', description: 'Schedule a new school event.' },
  'record-fee': { title: 'Record Fee Payment', description: 'Record a fee payment from a student.' },
  'add-visitor': { title: 'Add New Visitor', description: 'Register a new visitor at the reception.' },
  'collect-fee': { title: 'Collect Fee Payment', description: 'Collect a fee payment from a student.' },
  'schedule-appointment': { title: 'Schedule Appointment', description: 'Schedule a parent appointment.' },
  'assign-homework': { title: 'Assign Homework', description: 'Create a homework assignment for a class.' },
  'mark-attendance': { title: 'Mark Attendance', description: 'Take attendance for a class.' },
};

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function QuickActionModals({
  openModal,
  onClose,
  initialData,
  onTeacherAdded,
  onEventAdded,
}: QuickActionModalsProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>(initialData ?? {});

  useEffect(() => {
    setFormData(initialData ?? {});
  }, [initialData, openModal]);

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (type: QuickActionType) => {
    if (type === 'add-teacher') {
      const requiredFields = ['firstName', 'lastName', 'subject', 'phone', 'email'];
      const missing = requiredFields.find((field) => !formData[field]?.trim());
      if (missing) {
        toast.error('Please fill in all teacher details');
        return;
      }
    }

    if (type === 'add-event') {
      const requiredFields = ['title', 'date', 'time', 'location'];
      const missing = requiredFields.find((field) => !formData[field]?.trim());
      if (missing) {
        toast.error('Please fill in all event details');
        return;
      }
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const label = modalConfig[type].title.replace('New ', '').replace('Create ', '').replace('Record ', '').replace('Schedule ', '');

      if (type === 'add-teacher' && onTeacherAdded) {
        onTeacherAdded(formData);
      }

      if (type === 'add-event' && onEventAdded) {
        onEventAdded(formData);
      }

      toast.success(`${label} completed successfully`);
      setFormData({});
      onClose();
    }, 300);
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  const config = openModal ? modalConfig[openModal] : null;

  return (
    <Dialog open={!!openModal} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {config && (
          <>
            <DialogHeader>
              <DialogTitle>{config.title}</DialogTitle>
              <DialogDescription>{config.description}</DialogDescription>
            </DialogHeader>

            {/* Add Student */}
            {openModal === 'add-student' && (
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>First Name</Label><Input value={formData.firstName ?? ''} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Aarav" /></div>
                  <div className="space-y-1.5"><Label>Last Name</Label><Input value={formData.lastName ?? ''} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Sharma" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Class</Label><select className={selectClass} value={formData.class ?? ''} onChange={(e) => updateField('class', e.target.value)}><option value="">Select class</option>{classes.slice(0, 10).map((c) => <option key={c.id} value={c.grade}>{`Grade ${c.grade}`}</option>)}</select></div>
                  <div className="space-y-1.5"><Label>Section</Label><select className={selectClass} value={formData.section ?? ''} onChange={(e) => updateField('section', e.target.value)}><option value="">Select section</option><option value="A">A</option><option value="B">B</option></select></div>
                </div>
                <div className="space-y-1.5"><Label>Parent / Guardian Name</Label><Input value={formData.parentName ?? ''} onChange={(e) => updateField('parentName', e.target.value)} placeholder="Ramesh Sharma" /></div>
                <div className="space-y-1.5"><Label>Parent Phone</Label><Input value={formData.parentPhone ?? ''} onChange={(e) => updateField('parentPhone', e.target.value)} placeholder="+91 90000 00000" /></div>
              </div>
            )}

            {/* Add Teacher */}
            {openModal === 'add-teacher' && (
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>First Name</Label><Input value={formData.firstName ?? ''} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Anjali" /></div>
                  <div className="space-y-1.5"><Label>Last Name</Label><Input value={formData.lastName ?? ''} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Reddy" /></div>
                </div>
                <div className="space-y-1.5"><Label>Subject</Label><select className={selectClass} value={formData.subject ?? ''} onChange={(e) => updateField('subject', e.target.value)}><option value="">Select subject</option><option>Mathematics</option><option>Science</option><option>English</option><option>Social Studies</option><option>Hindi</option><option>Computer Science</option></select></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input value={formData.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="+91 90000 00000" /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={formData.email ?? ''} onChange={(e) => updateField('email', e.target.value)} placeholder="name@yovialschool.edu.in" /></div>
              </div>
            )}

            {/* Add Parent */}
            {openModal === 'add-parent' && (
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>Full Name</Label><Input value={formData.name ?? ''} onChange={(e) => updateField('name', e.target.value)} placeholder="Ramesh Sharma" /></div>
                <div className="space-y-1.5"><Label>Occupation</Label><Input value={formData.occupation ?? ''} onChange={(e) => updateField('occupation', e.target.value)} placeholder="Engineer" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Phone</Label><Input value={formData.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="+91 90000 00000" /></div>
                  <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={formData.email ?? ''} onChange={(e) => updateField('email', e.target.value)} placeholder="name@email.com" /></div>
                </div>
                <div className="space-y-1.5"><Label>Child Name (Student)</Label><Input value={formData.childName ?? ''} onChange={(e) => updateField('childName', e.target.value)} placeholder="Aarav Sharma" /></div>
              </div>
            )}

            {/* Create Announcement */}
            {openModal === 'create-announcement' && (
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>Audience</Label><select className={selectClass} value={formData.audience ?? ''} onChange={(e) => updateField('audience', e.target.value)}><option value="">Select audience</option><option>All Parents</option><option>All Students</option><option>All Teachers</option><option>Grade 6-10 Parents</option></select></div>
                <div className="space-y-1.5"><Label>Title</Label><Input value={formData.title ?? ''} onChange={(e) => updateField('title', e.target.value)} placeholder="Parent-Teacher Meeting" /></div>
                <div className="space-y-1.5"><Label>Message</Label><Textarea value={formData.message ?? ''} onChange={(e) => updateField('message', e.target.value)} placeholder="Type your announcement..." rows={3} /></div>
              </div>
            )}

            {/* Add Event */}
            {openModal === 'add-event' && (
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>Event Title</Label><Input value={formData.title ?? ''} onChange={(e) => updateField('title', e.target.value)} placeholder="Annual Sports Day" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={formData.date ?? ''} onChange={(e) => updateField('date', e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Time</Label><Input type="time" value={formData.time ?? ''} onChange={(e) => updateField('time', e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Location</Label><Input value={formData.location ?? ''} onChange={(e) => updateField('location', e.target.value)} placeholder="School Ground" /></div>
              </div>
            )}

            {/* Record Fee / Collect Fee */}
            {(openModal === 'record-fee' || openModal === 'collect-fee') && (
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>Student</Label><select className={selectClass} value={formData.student ?? ''} onChange={(e) => updateField('student', e.target.value)}><option value="">Select student</option>{students.slice(0, 20).map((s) => <option key={s.id} value={s.id}>{`${s.name} — ${s.classSection}`}</option>)}</select></div>
                <div className="space-y-1.5"><Label>Fee Type</Label><select className={selectClass} value={formData.feeType ?? ''} onChange={(e) => updateField('feeType', e.target.value)}><option value="">Select fee type</option><option>Tuition Fee</option><option>Transport Fee</option><option>Lab Fee</option><option>Library Fee</option><option>Exam Fee</option></select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={formData.amount ?? ''} onChange={(e) => updateField('amount', e.target.value)} placeholder="45000" /></div>
                  <div className="space-y-1.5"><Label>Payment Method</Label><select className={selectClass} value={formData.method ?? ''} onChange={(e) => updateField('method', e.target.value)}><option value="">Select method</option><option>Cash</option><option>Card</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option></select></div>
                </div>
              </div>
            )}

            {/* Add Visitor */}
            {openModal === 'add-visitor' && (
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>Visitor Name</Label><Input value={formData.name ?? ''} onChange={(e) => updateField('name', e.target.value)} placeholder="Ramesh Sharma" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Type</Label><select className={selectClass} value={formData.type ?? ''} onChange={(e) => updateField('type', e.target.value)}><option value="">Select type</option><option>Parent</option><option>Vendor</option><option>Guest</option><option>Official</option><option>Alumni</option></select></div>
                  <div className="space-y-1.5"><Label>Phone</Label><Input value={formData.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="+91 90000 00000" /></div>
                </div>
                <div className="space-y-1.5"><Label>Purpose</Label><Input value={formData.purpose ?? ''} onChange={(e) => updateField('purpose', e.target.value)} placeholder="Parent-Teacher Meeting" /></div>
                <div className="space-y-1.5"><Label>Visiting Person</Label><Input value={formData.visiting ?? ''} onChange={(e) => updateField('visiting', e.target.value)} placeholder="Anjali Reddy" /></div>
                <div className="space-y-1.5"><Label>ID Proof</Label><select className={selectClass} value={formData.idProof ?? ''} onChange={(e) => updateField('idProof', e.target.value)}><option value="">Select ID proof</option><option>Aadhaar</option><option>PAN Card</option><option>Driving License</option><option>Voter ID</option><option>Govt ID</option></select></div>
              </div>
            )}

            {/* Assign Homework */}
            {openModal === 'assign-homework' && (
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>Title</Label><Input value={formData.title ?? ''} onChange={(e) => updateField('title', e.target.value)} placeholder="Algebra Worksheet #5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Class</Label><select className={selectClass} value={formData.class ?? ''} onChange={(e) => updateField('class', e.target.value)}><option value="">Select class</option><option>10-A</option><option>10-B</option><option>9-A</option><option>9-B</option></select></div>
                  <div className="space-y-1.5"><Label>Subject</Label><select className={selectClass} value={formData.subject ?? ''} onChange={(e) => updateField('subject', e.target.value)}><option value="">Select subject</option><option>Mathematics</option><option>Science</option></select></div>
                </div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea value={formData.description ?? ''} onChange={(e) => updateField('description', e.target.value)} placeholder="Homework description..." rows={3} /></div>
                <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={formData.dueDate ?? ''} onChange={(e) => updateField('dueDate', e.target.value)} /></div>
              </div>
            )}

            {/* Mark Attendance */}
            {openModal === 'mark-attendance' && (
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Class</Label><select className={selectClass} value={formData.class ?? ''} onChange={(e) => updateField('class', e.target.value)}><option value="">Select class</option><option>10-A</option><option>10-B</option><option>9-A</option><option>9-B</option></select></div>
                  <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={formData.date ?? ''} onChange={(e) => updateField('date', e.target.value)} /></div>
                </div>
                <p className="text-sm text-muted-foreground">You will be taken to the attendance page to mark students present, absent, or late.</p>
              </div>
            )}

            {/* Schedule Appointment */}
            {openModal === 'schedule-appointment' && (
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5"><Label>Parent Name</Label><Input value={formData.parentName ?? ''} onChange={(e) => updateField('parentName', e.target.value)} placeholder="Ramesh Sharma" /></div>
                <div className="space-y-1.5"><Label>Student Name</Label><Input value={formData.studentName ?? ''} onChange={(e) => updateField('studentName', e.target.value)} placeholder="Aarav Sharma" /></div>
                <div className="space-y-1.5"><Label>Purpose</Label><Input value={formData.purpose ?? ''} onChange={(e) => updateField('purpose', e.target.value)} placeholder="Discuss academic performance" /></div>
                <div className="space-y-1.5"><Label>With Whom</Label><select className={selectClass} value={formData.withWhom ?? ''} onChange={(e) => updateField('withWhom', e.target.value)}><option value="">Select person</option><option>Principal</option><option>Class Teacher</option><option>Subject Teacher</option><option>Reception</option><option>Transport In-charge</option></select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={formData.date ?? ''} onChange={(e) => updateField('date', e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Time</Label><Input type="time" value={formData.time ?? ''} onChange={(e) => updateField('time', e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Phone</Label><Input value={formData.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} placeholder="+91 90000 00000" /></div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose} disabled={submitting}>Cancel</Button>
              <Button onClick={() => openModal && handleSubmit(openModal)} disabled={submitting}>
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
