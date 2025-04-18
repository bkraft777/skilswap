
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Coins, BadgeDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const POINT_PACKAGES = [
  { id: 1, amount: 100, price: "$5.00", popular: false },
  { id: 2, amount: 500, price: "$20.00", popular: true },
  { id: 3, amount: 1000, price: "$35.00", popular: false },
];

interface BuyPointsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BuyPointsDialog({ open, onOpenChange }: BuyPointsDialogProps = {}) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(open || false);
  const { toast } = useToast();
  
  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  
  const handleBuy = () => {
    if (!selectedPackage) return;
    
    // This is a placeholder - will be implemented with actual payment processing later
    toast({
      title: "Coming soon!",
      description: "Points purchase will be implemented in a future update.",
    });
    
    handleOpenChange(false);
  };

  return (
    <Dialog open={open !== undefined ? open : dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BadgeDollarSign className="h-4 w-4" />
          Buy Points
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Points</DialogTitle>
          <DialogDescription>
            Purchase points to book sessions with teachers
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {POINT_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer ${
                selectedPackage === pkg.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              } ${pkg.popular ? "relative overflow-hidden" : ""}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-0.5 rounded-bl-md">
                  Best Value
                </div>
              )}
              <div className="flex items-center gap-3">
                <Coins className={`h-6 w-6 ${selectedPackage === pkg.id ? "text-primary" : ""}`} />
                <div>
                  <p className="font-medium">{pkg.amount} Points</p>
                  <p className="text-sm text-muted-foreground">{pkg.price}</p>
                </div>
              </div>
              <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                {selectedPackage === pkg.id && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleBuy} 
            disabled={selectedPackage === null}
            className="w-full"
          >
            Purchase Points
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
