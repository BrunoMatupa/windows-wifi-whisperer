
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
    
    // Normally these would be real URLs to the built application
    // For demonstration, we'll show how you'd structure this
    const downloadLinks = {
      windows: "https://github.com/yourusername/wifi-whisperer/releases/latest/download/WiFi.Whisperer.Pro-Setup.exe",
      mac: "https://github.com/yourusername/wifi-whisperer/releases/latest/download/WiFi.Whisperer.Pro-mac.dmg",
      linux: "https://github.com/yourusername/wifi-whisperer/releases/latest/download/WiFi.Whisperer.Pro-linux.AppImage"
    };
    
    toast({
      title: "Download Instructions",
      description: "Since this is a demo, please follow these steps to build and install the app:",
      duration: 10000,
    });
    
    // Show instructions toast
    setTimeout(() => {
      toast({
        title: "Build Instructions",
        description: "1. Clone the repo 2. Run 'npm install' 3. Run 'npm run electron:build' 4. Find the installer in the 'release' folder",
        duration: 15000,
      });
    }, 1000);
    
    // Create and click a temporary download link for build instructions
    const tempLink = document.createElement('a');
    tempLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`
# WiFi Whisperer Installation Instructions

## Prerequisites
- Node.js and npm installed
- Git installed

## Steps to build and install
1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/wifi-whisperer.git
   cd wifi-whisperer
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Build the application for your platform:
   
   For Windows:
   \`\`\`
   npm run electron:windows
   \`\`\`
   
   For macOS:
   \`\`\`
   npm run electron:mac
   \`\`\`
   
   For Linux:
   \`\`\`
   npm run electron:linux
   \`\`\`

4. Find your installer in the 'release' folder

## Testing in development mode
You can also run the app in development mode:
\`\`\`
npm run electron:serve
\`\`\`

## Known Issues
- Make sure to allow the app to access your system's WiFi capabilities
- You may need administrator privileges to install and run the application
    `);
    tempLink.setAttribute('download', 'WiFi_Whisperer_Install_Instructions.txt');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
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
