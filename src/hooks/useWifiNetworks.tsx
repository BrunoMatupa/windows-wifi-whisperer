
import { useState, useEffect } from 'react';
import { Network } from '@/components/NetworkList';
import { toast } from 'sonner';
import { secureStorage } from '@/utils/secureStorage';

// This is a mock implementation since we can't interact with actual 
// Windows WiFi APIs in a browser environment
const useWifiNetworks = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);
  const [autoReconnect, setAutoReconnect] = useState<boolean>(true);

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

  // Simulate initial scan and automatic reconnection
  useEffect(() => {
    scanNetworks();
    
    // Attempt auto-reconnect to favorite networks
    const autoConnect = () => {
      if (!autoReconnect) return;
      
      const savedPasswords = secureStorage.getAllPasswords();
      if (savedPasswords.length === 0) return;
      
      const networkToConnect = networks.find(network => 
        network.favorite && 
        savedPasswords.some(saved => saved.ssid === network.ssid) &&
        !network.connected
      );
      
      if (networkToConnect) {
        toast.info(`Auto-connecting to ${networkToConnect.ssid}...`);
        const password = secureStorage.getPassword(networkToConnect.ssid);
        if (password) {
          setTimeout(() => {
            connectToNetwork(networkToConnect.ssid, password);
          }, 1500);
        }
      }
    };
    
    // Try auto-connect after networks are loaded
    if (networks.length > 0 && !isScanning) {
      autoConnect();
    }
  }, [isScanning, networks.length, autoReconnect]);

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
      toast.success("Network Scan Complete", {
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
      toast(network.favorite ? "Removed from Favorites" : "Added to Favorites", {
        description: `${ssid} has been ${network.favorite ? "removed from" : "added to"} your favorites`
      });
    }
  };

  const initiateConnect = (ssid: string) => {
    const network = networks.find(network => network.ssid === ssid);
    if (!network) return;
    
    setSelectedNetwork(network);
    
    if (network.secured) {
      // Check if we have a saved password
      const savedPassword = secureStorage.getPassword(ssid);
      if (savedPassword) {
        connectToNetwork(ssid, savedPassword);
      } else {
        setShowPasswordDialog(true);
      }
    } else {
      connectToNetwork(ssid, null);
    }
  };
  
  const connectToNetwork = (ssid: string, password: string | null) => {
    setConnectingNetwork(ssid);
    setShowPasswordDialog(false);
    
    // If we have a password, save it for future auto-reconnect
    if (password) {
      secureStorage.savePassword(ssid, password);
    }
    
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
      
      toast.success("Connected Successfully", {
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
    
    toast("Disconnected", {
      description: `You've disconnected from ${ssid}`
    });
  };

  const toggleAutoReconnect = () => {
    setAutoReconnect(prev => !prev);
    toast(autoReconnect ? "Auto-reconnect disabled" : "Auto-reconnect enabled");
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
    connectingNetwork,
    autoReconnect,
    toggleAutoReconnect
  };
};

export default useWifiNetworks;
