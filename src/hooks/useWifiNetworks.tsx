
import { useState, useEffect } from 'react';
import { Network } from '@/components/NetworkList';
import { toast } from '@/components/ui/use-toast';

// This is a mock implementation since we can't interact with actual 
// Windows WiFi APIs in a browser environment
const useWifiNetworks = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);

  // Mock data for demo purposes
  const mockNetworks: Network[] = [
    {
      ssid: 'Home_WiFi',
      signalStrength: 85,
      secured: true,
      connected: false,
      favorite: true,
      lastConnected: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      ssid: 'Neighbor_5G',
      signalStrength: 72,
      secured: true,
      connected: false,
      favorite: false,
    },
    {
      ssid: 'Coffee_Shop_Free',
      signalStrength: 60,
      secured: false,
      connected: false,
      favorite: true,
      lastConnected: new Date(Date.now() - 604800000), // 1 week ago
    },
    {
      ssid: 'Office_Network',
      signalStrength: 90,
      secured: true,
      connected: false,
      favorite: true,
    },
    {
      ssid: 'Guest_Network',
      signalStrength: 40,
      secured: true,
      connected: false,
      favorite: false,
    },
    {
      ssid: 'Public_WiFi',
      signalStrength: 30,
      secured: false,
      connected: false,
      favorite: false,
    },
    {
      ssid: 'Library_WiFi',
      signalStrength: 55,
      secured: true,
      connected: false,
      favorite: false,
    }
  ];

  // Simulate initial scan
  useEffect(() => {
    scanNetworks();
  }, []);

  const scanNetworks = () => {
    setIsScanning(true);
    // Simulate network scanning delay
    setTimeout(() => {
      // Randomize signal strengths a bit for realism
      const updatedNetworks = mockNetworks.map(network => ({
        ...network,
        signalStrength: Math.min(100, Math.max(0, network.signalStrength + Math.floor(Math.random() * 11) - 5))
      }));
      
      setNetworks(networks => {
        // Preserve connected and favorite status from current state
        return updatedNetworks.map(newNetwork => {
          const existingNetwork = networks.find(n => n.ssid === newNetwork.ssid);
          return {
            ...newNetwork,
            connected: existingNetwork?.connected || false,
            favorite: existingNetwork?.favorite !== undefined ? existingNetwork.favorite : newNetwork.favorite
          };
        });
      });
      
      setIsScanning(false);
      toast({
        title: "Network Scan Complete",
        description: `Found ${mockNetworks.length} networks`
      });
    }, 2000);
  };

  const toggleFavorite = (ssid: string) => {
    setNetworks(networks => 
      networks.map(network => 
        network.ssid === ssid 
          ? { ...network, favorite: !network.favorite } 
          : network
      )
    );
    
    const network = networks.find(network => network.ssid === ssid);
    if (network) {
      toast({
        title: network.favorite ? "Removed from Favorites" : "Added to Favorites",
        description: `${ssid} has been ${network.favorite ? "removed from" : "added to"} your favorites`
      });
    }
  };

  const initiateConnect = (ssid: string) => {
    const network = networks.find(network => network.ssid === ssid);
    if (!network) return;
    
    setSelectedNetwork(network);
    
    if (network.secured) {
      setShowPasswordDialog(true);
    } else {
      connectToNetwork(ssid, null);
    }
  };
  
  const connectToNetwork = (ssid: string, password: string | null) => {
    setConnectingNetwork(ssid);
    setShowPasswordDialog(false);
    
    // Simulate connection delay
    setTimeout(() => {
      // In a real app, this would call Windows APIs to connect
      setNetworks(networks => 
        networks.map(network => ({
          ...network,
          connected: network.ssid === ssid ? true : false,
          lastConnected: network.ssid === ssid ? new Date() : network.lastConnected
        }))
      );
      
      setConnectingNetwork(null);
      
      toast({
        title: "Connected Successfully",
        description: `You're now connected to ${ssid}`
      });
    }, 1500);
  };

  const disconnectFromNetwork = (ssid: string) => {
    setNetworks(networks => 
      networks.map(network => ({
        ...network,
        connected: network.ssid === ssid ? false : network.connected
      }))
    );
    
    toast({
      title: "Disconnected",
      description: `You've disconnected from ${ssid}`
    });
  };

  return {
    networks,
    isScanning,
    scanNetworks,
    toggleFavorite,
    initiateConnect,
    connectToNetwork,
    disconnectFromNetwork,
    selectedNetwork,
    showPasswordDialog,
    setShowPasswordDialog,
    connectingNetwork
  };
};

export default useWifiNetworks;
