
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WiFiNetwork, { WiFiNetworkProps } from './WiFiNetwork';

export interface Network extends Omit<WiFiNetworkProps, 'onConnect' | 'onToggleFavorite'> {
  lastConnected?: Date;
}

interface NetworkListProps {
  networks: Network[];
  onConnect: (ssid: string) => void;
  onToggleFavorite: (ssid: string) => void;
  isScanning: boolean;
}

const NetworkList: React.FC<NetworkListProps> = ({
  networks,
  onConnect,
  onToggleFavorite,
  isScanning
}) => {
  const favoriteNetworks = networks.filter(network => network.favorite);
  const connectedNetworks = networks.filter(network => network.connected);
  
  // Sort networks by signal strength
  const sortedNetworks = [...networks].sort((a, b) => b.signalStrength - a.signalStrength);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-4">
        <TabsTrigger value="all">All Networks</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
        <TabsTrigger value="connected">Connected</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-2">
        {isScanning ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-8 w-8 border-t-2 border-primary rounded-full animate-spin mb-2"></div>
            <p className="text-muted-foreground">Scanning for networks...</p>
          </div>
        ) : sortedNetworks.length > 0 ? (
          sortedNetworks.map(network => (
            <WiFiNetwork
              key={network.ssid}
              {...network}
              onConnect={onConnect}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No networks found. Click "Scan" to refresh.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="favorites" className="space-y-2">
        {favoriteNetworks.length > 0 ? (
          favoriteNetworks.map(network => (
            <WiFiNetwork
              key={network.ssid}
              {...network}
              onConnect={onConnect}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No favorite networks. Star networks to add them here.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="connected" className="space-y-2">
        {connectedNetworks.length > 0 ? (
          connectedNetworks.map(network => (
            <WiFiNetwork
              key={network.ssid}
              {...network}
              onConnect={onConnect}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Not connected to any networks.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default NetworkList;
