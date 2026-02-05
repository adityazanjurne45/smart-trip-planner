 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Download, Loader2, FileText, Check } from "lucide-react";
 import { TripDetails, Recommendations } from "@/types/trip";
 import { toast } from "@/hooks/use-toast";
 
 interface TripPDFDownloadProps {
   tripDetails: TripDetails;
   recommendations: Recommendations;
 }
 
 const TripPDFDownload = ({ tripDetails, recommendations }: TripPDFDownloadProps) => {
   const [isGenerating, setIsGenerating] = useState(false);
   const [isComplete, setIsComplete] = useState(false);
 
   const generatePDF = async () => {
     setIsGenerating(true);
     try {
       const { jsPDF } = await import("jspdf");
       const doc = new jsPDF();
 
       // Header
       doc.setFillColor(14, 165, 151); // Primary teal color
       doc.rect(0, 0, 210, 40, "F");
       doc.setTextColor(255, 255, 255);
       doc.setFontSize(24);
       doc.setFont("helvetica", "bold");
       doc.text("Travello Trip Plan", 20, 25);
 
       // Trip Details
       doc.setTextColor(0, 0, 0);
       doc.setFontSize(16);
       doc.setFont("helvetica", "bold");
       doc.text(`${tripDetails.boardingPoint} → ${tripDetails.destinationPoint}`, 20, 55);
 
       doc.setFontSize(11);
       doc.setFont("helvetica", "normal");
       doc.text(`Duration: ${tripDetails.duration} days | Budget: $${tripDetails.budget}`, 20, 63);
 
       // Summary
       doc.setFontSize(12);
       doc.setFont("helvetica", "bold");
       doc.text("Trip Summary", 20, 78);
       doc.setFont("helvetica", "normal");
       doc.setFontSize(10);
       const summaryLines = doc.splitTextToSize(recommendations.summary, 170);
       doc.text(summaryLines, 20, 86);
 
       let yPos = 95 + summaryLines.length * 5;
 
       // Tourist Places
       doc.setFontSize(12);
       doc.setFont("helvetica", "bold");
       doc.text("Tourist Places", 20, yPos);
       yPos += 8;
 
       doc.setFont("helvetica", "normal");
       doc.setFontSize(10);
       recommendations.touristPlaces.forEach((place, index) => {
         if (yPos > 270) {
           doc.addPage();
           yPos = 20;
         }
         doc.setFont("helvetica", "bold");
         doc.text(`${index + 1}. ${place.name}`, 20, yPos);
         yPos += 5;
         doc.setFont("helvetica", "normal");
         const descLines = doc.splitTextToSize(place.description, 160);
         doc.text(descLines, 25, yPos);
         yPos += descLines.length * 4 + 2;
         doc.text(`Time: ${place.estimatedTime} | Entry: ${place.entryFee}`, 25, yPos);
         if (place.crowdLevel) {
           doc.text(` | Crowd: ${place.crowdLevel}`, 100, yPos);
         }
         yPos += 8;
       });
 
       // Hotels
       yPos += 5;
       if (yPos > 250) {
         doc.addPage();
         yPos = 20;
       }
       doc.setFontSize(12);
       doc.setFont("helvetica", "bold");
       doc.text("Recommended Hotels", 20, yPos);
       yPos += 8;
 
       doc.setFont("helvetica", "normal");
       doc.setFontSize(10);
       recommendations.hotels.forEach((hotel) => {
         if (yPos > 270) {
           doc.addPage();
           yPos = 20;
         }
         doc.setFont("helvetica", "bold");
         doc.text(`• ${hotel.name}`, 20, yPos);
         doc.setFont("helvetica", "normal");
         yPos += 5;
         doc.text(`${hotel.location} | ${hotel.pricePerNight}/night | Rating: ${hotel.rating}★`, 25, yPos);
         yPos += 7;
       });
 
       // Transportation
       yPos += 5;
       if (yPos > 250) {
         doc.addPage();
         yPos = 20;
       }
       doc.setFontSize(12);
       doc.setFont("helvetica", "bold");
       doc.text("Transportation Options", 20, yPos);
       yPos += 8;
 
       doc.setFont("helvetica", "normal");
       doc.setFontSize(10);
       recommendations.vehicles.forEach((vehicle) => {
         if (yPos > 270) {
           doc.addPage();
           yPos = 20;
         }
         doc.text(`• ${vehicle.type}: ${vehicle.estimatedCost}`, 20, yPos);
         yPos += 5;
         doc.text(`${vehicle.reason}`, 25, yPos);
         if (vehicle.whereToFind) {
           yPos += 5;
           doc.text(`Where to find: ${vehicle.whereToFind}`, 25, yPos);
         }
         yPos += 7;
       });
 
       // Safety Info
       if (recommendations.safetyInfo) {
         yPos += 5;
         if (yPos > 240) {
           doc.addPage();
           yPos = 20;
         }
         doc.setFontSize(12);
         doc.setFont("helvetica", "bold");
         doc.text("Emergency Contacts", 20, yPos);
         yPos += 8;
 
         doc.setFont("helvetica", "normal");
         doc.setFontSize(10);
         const numbers = recommendations.safetyInfo.emergencyNumbers;
         if (numbers.police) doc.text(`Police: ${numbers.police}`, 20, yPos), yPos += 5;
         if (numbers.ambulance) doc.text(`Ambulance: ${numbers.ambulance}`, 20, yPos), yPos += 5;
         if (numbers.fire) doc.text(`Fire: ${numbers.fire}`, 20, yPos), yPos += 5;
         if (numbers.tourist_helpline) doc.text(`Tourist Helpline: ${numbers.tourist_helpline}`, 20, yPos), yPos += 5;
       }
 
       // Cost Saving Tips
       if (recommendations.costSavingTips && recommendations.costSavingTips.length > 0) {
         yPos += 8;
         if (yPos > 240) {
           doc.addPage();
           yPos = 20;
         }
         doc.setFontSize(12);
         doc.setFont("helvetica", "bold");
         doc.text("Cost-Saving Tips", 20, yPos);
         yPos += 8;
 
         doc.setFont("helvetica", "normal");
         doc.setFontSize(10);
         recommendations.costSavingTips.forEach((tip) => {
           if (yPos > 270) {
             doc.addPage();
             yPos = 20;
           }
           doc.text(`• ${tip.tip} (Save: ${tip.savingsEstimate})`, 20, yPos);
           yPos += 6;
         });
       }
 
       // Footer
       const pageCount = doc.getNumberOfPages();
       for (let i = 1; i <= pageCount; i++) {
         doc.setPage(i);
         doc.setFontSize(8);
         doc.setTextColor(128, 128, 128);
         doc.text(
           `Generated by Travello - AI Trip Planning | Page ${i} of ${pageCount}`,
           105,
           290,
           { align: "center" }
         );
       }
 
       // Save
       const filename = `travello-${tripDetails.destinationPoint
         .toLowerCase()
         .replace(/[^a-z0-9]/g, "-")}-trip.pdf`;
       doc.save(filename);
 
       setIsComplete(true);
       setTimeout(() => setIsComplete(false), 3000);
 
       toast({
         title: "PDF Downloaded!",
         description: "Your complete trip plan has been saved as a PDF file.",
       });
     } catch (error) {
       console.error("PDF generation error:", error);
       toast({
         title: "Error",
         description: "Failed to generate PDF. Please try again.",
         variant: "destructive",
       });
     } finally {
       setIsGenerating(false);
     }
   };
 
   return (
     <Button
       variant="outline"
       size="sm"
       onClick={generatePDF}
       disabled={isGenerating}
       className="gap-2"
     >
       {isGenerating ? (
         <>
           <Loader2 className="w-4 h-4 animate-spin" />
           Generating...
         </>
       ) : isComplete ? (
         <>
           <Check className="w-4 h-4 text-green-500" />
           Downloaded!
         </>
       ) : (
         <>
           <FileText className="w-4 h-4" />
           Download PDF
         </>
       )}
     </Button>
   );
 };
 
 export default TripPDFDownload;