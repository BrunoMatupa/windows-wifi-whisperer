
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from './NetworkList';
import { Wifi, Clock, Shield, SignalHigh } from 'lucide-react';

interface ConnectionDetailsProps {
  network: Network | null;
}

const ConnectionDetails: React.FC<ConnectionDetailsProps> = ({
  network
}) => {
  if (!network) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          Connection Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <SignalHigh className="h-4 w-4 text-muted-foreground" />
              Network Name
            </p>
            <p className="text-sm text-muted-foreground">{network.ssid}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Security
            </p>
            <p className="text-sm text-muted-foreground">
              {network.secured ? 'Secured (WPA/WPA2)' : 'Open (Unsecured)'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <SignalHigh className="h-4 w-4 text-muted-foreground" />
              Signal Strength
            </p>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${network.signalStrength}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{network.signalStrength}%</span>
            </div>
          </div>
          
          {network.lastConnected && (
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Last Connected
              </p>
              <p className="text-sm text-muted-foreground">
                {network.lastConnected.toLocaleString()}
              </p>
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Connection Status</p>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${network.connected ? 'bg-green-500' : 'bg-amber-500'}`} />
            <p className="text-sm text-muted-foreground">
              {network.connected ? 'Connected' : 'Not Connected'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionDetails;
