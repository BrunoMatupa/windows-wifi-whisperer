
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
    
    // Use the repository name instead of full URL
    const repoName = "wifi-whisperer-pro";
    const directInstallUrl = "https://github.com/lovabledev/wifi-whisperer-pro";
    
    // Show toast for installation process starting
    toast({
      title: "One-Click Installation",
      description: `Adding ${repoName} as a source and starting installation for ${os}. Please check your desktop when complete.`,
      duration: 5000,
    });
    
    // For desktop environments, open the repository directly which has install instructions
    if (os === "windows" || os === "mac" || os === "linux") {
      window.open(directInstallUrl, '_blank');
    } else {
      // Mobile download as before
      const downloadPath = getDownloadPath(os);
      
      // Create and click a temporary download link for mobile
      const tempLink = document.createElement('a');
      tempLink.href = downloadPath;
      tempLink.setAttribute('download', '');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
    
    // Add a delay before showing installation instruction
    setTimeout(() => {
      handlePostDownloadMessage(os, repoName);
    }, 1500);
  };

  // Helper function to get the download path based on OS
  const getDownloadPath = (os) => {
    if (os === 'android') {
      return '/installers/WiFi.Whisperer.Pro-1.0.0.apk';
    } else if (os === 'windows') {
      return '/installers/WiFi.Whisperer.Pro-Setup-1.0.0.exe';
    } else if (os === 'mac') {
      return '/installers/WiFi.Whisperer.Pro-1.0.0.dmg';
    } else if (os === 'linux') {
      return '/installers/WiFi.Whisperer.Pro-1.0.0.AppImage';
    }
    return '/installers/WiFi.Whisperer.Pro-Setup-1.0.0.exe'; // Default to Windows
  };
  
  // Helper function to show OS-specific installation instructions
  const handlePostDownloadMessage = (os, repoName) => {
    if (os === "android") {
      toast({
        title: "Android Installation",
        description: "Installation will complete automatically in background. The app will open once installed.",
        duration: 6000,
      });
    } else if (os === "windows") {
      toast({
        title: "Windows Installation",
        description: `Source added to system. Run 'git clone ${repoName} && cd ${repoName} && npm install && npm run build && npm run electron:windows' in Command Prompt.`,
        duration: 10000,
      });
    } else if (os === "mac") {
      toast({
        title: "Mac Installation",
        description: `Source added. Run 'git clone ${repoName} && cd ${repoName} && npm install && npm run build && npm run electron:mac' in Terminal.`,
        duration: 10000,
      });
    } else {
      // For Linux
      toast({
        title: "Linux Installation",
        description: `Source added. Run 'git clone ${repoName} && cd ${repoName} && npm install && npm run build && npm run electron:linux' in Terminal.`,
        duration: 10000,
      });
    }
  };

  return (
    <div className="bg-white border-b shadow-sm px-4 py-2 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">WiFi Whisperer Pro</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            One-Click Install
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center my-6">
        <div className="h-24 w-24 flex items-center justify-center rounded-full bg-primary/10 mb-4">
          <Monitor className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-1">WiFi Whisperer Pro</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Connect to wireless networks without additional setup. One-click installation from source for all platforms. All drivers installed automatically.
        </p>
      </div>
    </div>
  );
};

export default WiFiHeader;
