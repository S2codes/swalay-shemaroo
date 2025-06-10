import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ChangeAlbumStatusProps {
  albumId: string;
  shemaroDeliveryStatus?: number;
  onStatusChange?: (newStatus: number) => void;
}

const STATUS_OPTIONS = [
  { label: "Live", value: 2 },
  { label: "Rejected", value: 3 },
];

// export default function ChangeAlbumStatus({ albumId, shemaroDeliveryStatus, onStatusChange }: ChangeAlbumStatusProps) {
export default function ChangeAlbumStatus({ albumId,  onStatusChange }: ChangeAlbumStatusProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();


  

  const handleSubmit = async () => {
    if (status === undefined) return;
    setSubmitting(true);
    try {
      const response = await axios.post("https://root.swalayplus.in/api/shemaroo/updatealbumstatus", {
        albumId,
        status,
      });


      toast({
        title: "Status Updated",
        description: `Album status changed to ${STATUS_OPTIONS.find(opt => opt.value === status)?.label}`,
      });

      setOpen(false);
      if (onStatusChange) onStatusChange(status);
      
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update album status.",
      });
    } finally {
      setSubmitting(false);
    }
  };




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Change Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Album Status</DialogTitle>
          <DialogDescription>
            Select a new status for this album.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={status?.toString()} onValueChange={v => setStatus(Number(v))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={submitting || status === undefined}>
            {submitting ? "Updating..." : "Submit"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 