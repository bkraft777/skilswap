
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Award } from "lucide-react";
import type { SkillOffering } from "@/hooks/useSkillOfferings";
import { BookSkillDialog } from "./BookSkillDialog";

interface SkillOfferingCardProps {
  offering: SkillOffering;
}

export const SkillOfferingCard = ({ offering }: SkillOfferingCardProps) => {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{offering.skill}</h3>
            <Badge variant="secondary" className="mt-1">
              {offering.experience_level}
            </Badge>
          </div>
          <Badge variant="default" className="ml-2">
            {offering.points_cost} points
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{offering.description}</p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>Available: {offering.availability.join(", ")}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Award className="w-4 h-4 mr-2" />
            <span>Experience: {offering.experience_level}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => setBookingOpen(true)} 
          className="w-full"
        >
          Book Session
        </Button>
      </CardFooter>

      <BookSkillDialog
        offering={offering}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </Card>
  );
};
