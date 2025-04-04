
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Monitor, Menu } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const WiFiHeader = () => {
  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "WiFi Whisperer is being downloaded to your desktop.",
      duration: 3000,
    });
    
    // In a real application, this would trigger an actual download
    // For demonstration purposes, we'll just show a toast
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: "WiFi Whisperer has been installed on your desktop.",
        duration: 5000,
      });
    }, 2000);
  };

  return (
    <div className="bg-white border-b shadow-sm px-4 py-2 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">WiFi Whisperer</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download for Desktop
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center my-6">
        <div className="h-24 w-24 flex items-center justify-center rounded-full bg-primary/10 mb-4">
          <Monitor className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-1">WiFi Whisperer</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Connect to wireless networks without additional software. Now available for your Windows desktop.
        </p>
      </div>
    </div>
  );
};

export default WiFiHeader;
