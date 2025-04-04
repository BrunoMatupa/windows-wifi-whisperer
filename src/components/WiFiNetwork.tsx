
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Star, 
  StarOff
} from "lucide-react";

export interface WiFiNetworkProps {
  ssid: string;
  signalStrength: number; // 0-100
  secured: boolean;
  connected: boolean;
  favorite: boolean;
  onConnect: (ssid: string) => void;
  onToggleFavorite: (ssid: string) => void;
}

const WiFiNetwork: React.FC<WiFiNetworkProps> = ({
  ssid,
  signalStrength,
  secured,
  connected,
  favorite,
  onConnect,
  onToggleFavorite
}) => {
  // Convert signal strength to bars (0-4)
  const getSignalBars = () => {
    if (signalStrength >= 80) return 4;
    if (signalStrength >= 60) return 3;
    if (signalStrength >= 40) return 2;
    if (signalStrength >= 20) return 1;
    return 0;
  };

  const signalBars = getSignalBars();

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors duration-200 ${connected ? 'bg-primary/5 border border-primary/20' : ''}`}>
      <div className="flex items-center gap-3 flex-1">
        <div className="relative h-8 w-8 flex items-center justify-center">
          {signalBars > 0 ? (
            <Wifi 
              className={`h-6 w-6 ${connected ? 'text-primary' : 'text-foreground'}`} 
            />
          ) : (
            <WifiOff className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{ssid}</span>
            {secured && <Lock className="h-3 w-3 text-muted-foreground" />}
            {connected && (
              <span className="flex items-center text-xs text-primary">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Signal: {signalStrength}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(ssid)}
          className="text-amber-500"
        >
          {favorite ? (
            <Star className="h-4 w-4 fill-current" />
          ) : (
            <StarOff className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant={connected ? "outline" : "default"}
          size="sm"
          onClick={() => onConnect(ssid)}
          disabled={connected}
        >
          {connected ? 'Connected' : 'Connect'}
        </Button>
      </div>
    </div>
  );
};

export default WiFiNetwork;
