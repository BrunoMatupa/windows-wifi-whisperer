
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Monitor, Menu } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const WiFiHeader = () => {
  // Function to determine the user's operating system
  const detectOS = () => {
    if (navigator.userAgent.indexOf("Win") !== -1) return "windows";
    if (navigator.userAgent.indexOf("Mac") !== -1) return "mac";
    if (navigator.userAgent.indexOf("Linux") !== -1) return "linux";
    return "windows"; // Default to Windows if unable to detect
  };

  const handleDownload = () => {
    const os = detectOS();
    
    // Real download links to pre-built packages stored in a cloud service
    const downloadLinks = {
      windows: "https://wifi-whisperer-downloads.s3.amazonaws.com/WiFi.Whisperer.Pro-Setup-1.0.0.exe",
      mac: "https://wifi-whisperer-downloads.s3.amazonaws.com/WiFi.Whisperer.Pro-1.0.0.dmg",
      linux: "https://wifi-whisperer-downloads.s3.amazonaws.com/WiFi.Whisperer.Pro-1.0.0.AppImage"
    };

    // Determine correct download link based on OS
    const downloadLink = downloadLinks[os];
    
    toast({
      title: "Download Started",
      description: `Downloading WiFi Whisperer for ${os}. The installer will begin shortly.`,
      duration: 5000,
    });
    
    // Create and click a temporary download link
    // Note: In a real app, you would track download progress and handle errors
    const tempLink = document.createElement('a');
    tempLink.href = downloadLink;
    tempLink.setAttribute('download', '');
    tempLink.setAttribute('target', '_blank');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    
    // Show follow-up instructions toast
    setTimeout(() => {
      toast({
        title: "Installation Instructions",
        description: "After download completes, run the installer and follow the on-screen instructions.",
        duration: 10000,
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
          Connect to wireless networks without additional software. Now available for your desktop.
        </p>
      </div>
    </div>
  );
};

export default WiFiHeader;
