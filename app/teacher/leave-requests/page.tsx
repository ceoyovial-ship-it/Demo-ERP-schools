'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Check, X, Clock, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { SectionCard } from '@/components/section-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { leaveRequests, type LeaveRequest } from '@/lib/teacher-data';

const selectClassStyle =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<LeaveRequest | null>(null);
  const [actionItem, setActionItem] = useState<{ request: LeaveRequest; action: 'approve' | 'reject' } | null>(null);
  const [processing, setProcessing] = useState(false);

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (q && !r.studentName.toLowerCase().includes(q) && !r.reason.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [requests, statusFilter, search]);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const handleAction = () => {
    if (!actionItem) return;
    setProcessing(true);
    setTimeout(() => {
      const newStatus = actionItem.action === 'approve' ? 'approved' : 'rejected';
      setRequests((prev) => prev.map((r) => r.id === actionItem.request.id ? { ...r, status: newStatus as LeaveRequest['status'] } : r));
      setProcessing(false);
      toast.success(`Leave request ${newStatus}`, { description: `${actionItem.request.studentName} — ${actionItem.request.reason}` });
      setActionItem(null);
    }, 1000);
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-accent', bg: 'bg-accent/10', variant: 'secondary' as const },
    approved: { icon: Check, color: 'text-success', bg: 'bg-success/10', variant: 'default' as const },
    rejected: { icon: X, color: 'text-destructive', bg: 'bg-destructive/10', variant: 'secondary' as const },
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Requests" description="Approve or reject student leave applications" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total" value={requests.length} icon={ClipboardCheck} delay={0} />
        <StatCard title="Pending" value={pendingCount} icon={Clock} changeType="neutral" delay={0.05} />
        <StatCard title="Approved" value={approvedCount} icon={Check} changeType="positive" delay={0.1} />
        <StatCard title="Rejected" value={rejectedCount} icon={X} changeType="negative" delay={0.15} />
      </div>

      <SectionCard title="Leave Requests" description={`${filteredRequests.length} requests`} delay={0.2}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <select className={selectClassStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
                <option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:min-w-[240px]">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input placeholder="Search student or reason..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRequests.map((req, i) => {
            const config = statusConfig[req.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border p-4 transition-all hover:shadow-premium"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{req.studentName}</p>
                      <Badge variant="outline" className="text-xs">Roll #{req.rollNumber}</Badge>
                      <Badge variant={config.variant} className={`text-xs capitalize ${config.bg} ${config.color}`}>{req.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{req.reason}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>From: {req.fromDate}</span>
                      <span>To: {req.toDate}</span>
                      <span>{req.days} day{req.days > 1 ? 's' : ''}</span>
                      <span>Parent: {req.parentName}</span>
                      <span>Applied: {req.appliedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewItem(req)}><Eye className="h-4 w-4" /></Button>
                    {req.status === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-success" onClick={() => setActionItem({ request: req, action: 'approve' })}>
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-destructive" onClick={() => setActionItem({ request: req, action: 'reject' })}>
                          <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {filteredRequests.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No leave requests found</div>
          )}
        </div>
      </SectionCard>

      {/* View Modal */}
      <Dialog open={!!viewItem} onOpenChange={(open) => { if (!open) setViewItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Leave Request Details</DialogTitle><DialogDescription>{viewItem?.studentName} · Roll #{viewItem?.rollNumber}</DialogDescription></DialogHeader>
          {viewItem && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Student</Label><p className="mt-1 text-sm font-medium">{viewItem.studentName}</p></div>
                <div><Label className="text-xs text-muted-foreground">Parent</Label><p className="mt-1 text-sm font-medium">{viewItem.parentName}</p></div>
                <div><Label className="text-xs text-muted-foreground">From Date</Label><p className="mt-1 text-sm">{viewItem.fromDate}</p></div>
                <div><Label className="text-xs text-muted-foreground">To Date</Label><p className="mt-1 text-sm">{viewItem.toDate}</p></div>
                <div><Label className="text-xs text-muted-foreground">Duration</Label><p className="mt-1 text-sm">{viewItem.days} day{viewItem.days > 1 ? 's' : ''}</p></div>
                <div><Label className="text-xs text-muted-foreground">Applied Date</Label><p className="mt-1 text-sm">{viewItem.appliedDate}</p></div>
              </div>
              <div><Label className="text-xs text-muted-foreground">Reason</Label><p className="mt-1 text-sm">{viewItem.reason}</p></div>
              <div className="flex items-center gap-2">
                <Badge variant={statusConfig[viewItem.status].variant} className={`capitalize ${statusConfig[viewItem.status].bg} ${statusConfig[viewItem.status].color}`}>{viewItem.status}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation */}
      <AlertDialog open={!!actionItem} onOpenChange={(open) => { if (!open) setActionItem(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionItem?.action === 'approve' ? 'Approve' : 'Reject'} Leave Request?</AlertDialogTitle>
            <AlertDialogDescription>
              {actionItem?.action === 'approve'
                ? `You are approving ${actionItem?.request.studentName}'s leave from ${actionItem?.request.fromDate} to ${actionItem?.request.toDate}.`
                : `You are rejecting ${actionItem?.request.studentName}'s leave request.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={processing}
              className={actionItem?.action === 'approve' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : actionItem?.action === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
