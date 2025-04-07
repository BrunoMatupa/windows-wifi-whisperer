
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Monitor, Menu, Phone } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const WiFiHeader = () => {
  // Function to determine the user's operating system
  const detectOS = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("android") !== -1) return "android";
    if (userAgent.indexOf("win") !== -1) return "windows";
    if (userAgent.indexOf("mac") !== -1) return "mac";
    if (userAgent.indexOf("linux") !== -1) return "linux";
    return "windows"; // Default to Windows if unable to detect
  };

  const handleDownload = () => {
    const os = detectOS();
    
    // Build the base URL for where our app is hosted
    const baseUrl = window.location.origin;
    
    // Local file paths to the installers that would be available after building
    const downloadLinks = {
      android: `${baseUrl}/installers/WiFi.Whisperer.Pro-1.0.0.apk`,
      windows: `${baseUrl}/installers/WiFi.Whisperer.Pro-Setup-1.0.0.exe`,
      mac: `${baseUrl}/installers/WiFi.Whisperer.Pro-1.0.0.dmg`,
      linux: `${baseUrl}/installers/WiFi.Whisperer.Pro-1.0.0.AppImage`
    };

    // Determine correct download link based on OS
    const downloadLink = downloadLinks[os];
    
    toast({
      title: "Download Starting",
      description: `Installing WiFi Whisperer for ${os}...`,
      duration: 3000,
    });
    
    // In development environment, show a toast explaining that downloads are simulated
    if (process.env.NODE_ENV === 'development') {
      toast({
        title: "Development Mode",
        description: "This is a development environment. In production, this would download the actual installer.",
        duration: 5000,
      });
      
      // Still trigger the OS-specific follow-up messages
      handlePostDownloadMessage(os);
      return;
    }
    
    // Create and click a temporary download link
    const tempLink = document.createElement('a');
    tempLink.href = downloadLink;
    tempLink.setAttribute('download', '');
    tempLink.setAttribute('target', '_blank');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    
    handlePostDownloadMessage(os);
  };
  
  // Helper function to show OS-specific installation instructions
  const handlePostDownloadMessage = (os) => {
    if (os === "android") {
      setTimeout(() => {
        toast({
          title: "Android Installation",
          description: "Once download completes, tap the APK file to install. You may need to enable 'Install from Unknown Sources' in your settings.",
          duration: 6000,
        });
      }, 2000);
    } else if (os === "windows") {
      setTimeout(() => {
        toast({
          title: "Installation Started",
          description: "WiFi Whisperer will install automatically when download completes.",
          duration: 5000,
        });
      }, 2000);
    } else if (os === "mac") {
      // For Mac, show DMG mounting instructions
      setTimeout(() => {
        toast({
          title: "Installation",
          description: "When download completes, open the DMG file and drag WiFi Whisperer to Applications.",
          duration: 5000,
        });
      }, 2000);
    } else {
      // For Linux
      setTimeout(() => {
        toast({
          title: "Installation",
          description: "When download completes, make the AppImage executable and run it.",
          duration: 5000,
        });
      }, 2000);
    }
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
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Install App
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center my-6">
        <div className="h-24 w-24 flex items-center justify-center rounded-full bg-primary/10 mb-4">
          <Monitor className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-1">WiFi Whisperer</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Connect to wireless networks without additional software. One-click installation for your desktop or mobile device.
        </p>
      </div>
    </div>
  );
};

export default WiFiHeader;
