import { useState, useEffect } from 'react';
import { Network } from '@/components/NetworkList';
import { toast } from 'sonner';
import { secureStorage } from '@/utils/secureStorage';

const isElectron = (): boolean => {
  try {
    return window.api && window.api.isElectron();
  } catch (e) {
    return false;
  }
};

const useWifiNetworks = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [connectingNetwork, setConnectingNetwork] = useState<string | null>(null);
  const [autoReconnect, setAutoReconnect] = useState<boolean>(true);

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

  const scanNetworks = async () => {
    setIsScanning(true);
    
    try {
      if (isElectron()) {
        const result = await window.api.getWifiNetworks();
        
        if (result.success) {
          setNetworks(prevNetworks => {
            return result.networks.map((newNetwork: any) => {
              const existingNetwork = prevNetworks.find(n => n.ssid === newNetwork.ssid);
              return {
                ...newNetwork,
                favorite: existingNetwork?.favorite !== undefined ? 
                  existingNetwork.favorite : newNetwork.favorite
              };
            });
          });
          
          toast.success("Network Scan Complete", {
            description: `Found ${result.networks.length} networks`
          });
        } else {
          toast.error("Scan Failed", {
            description: result.error || "Unknown error"
          });
          
          setNetworks(mockNetworks);
        }
      } else {
        setTimeout(() => {
          const updatedNetworks = mockNetworks.map(network => ({
            ...network,
            signalStrength: Math.min(100, Math.max(0, network.signalStrength + Math.floor(Math.random() * 11) - 5))
          }));
          
          setNetworks(networks => {
            return updatedNetworks.map(newNetwork => {
              const existingNetwork = networks.find(n => n.ssid === newNetwork.ssid);
              return {
                ...newNetwork,
                connected: existingNetwork?.connected || false,
                favorite: existingNetwork?.favorite !== undefined ? existingNetwork.favorite : newNetwork.favorite
              };
            });
          });
          
          toast.success("Network Scan Complete", {
            description: `Found ${mockNetworks.length} networks`
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Error scanning networks:", error);
      toast.error("Scan Failed", {
        description: "Could not scan for networks"
      });
      
      setNetworks(mockNetworks);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    scanNetworks();
    
    const autoConnect = () => {
      if (!autoReconnect) return;
      
      const tryConnectToSaved = async () => {
        let savedPasswords: {ssid: string, password: string}[] = [];
        
        if (isElectron()) {
          try {
            const result = await window.api.getAllPasswords();
            if (result.success) {
              savedPasswords = result.passwords;
            }
          } catch (error) {
            console.error("Error getting saved passwords:", error);
          }
        } else {
          savedPasswords = secureStorage.getAllPasswords();
        }
        
        if (savedPasswords.length === 0) return;
        
        const networkToConnect = networks.find(network => 
          network.favorite && 
          savedPasswords.some(saved => saved.ssid === network.ssid) &&
          !network.connected
        );
        
        if (networkToConnect) {
          toast.info(`Auto-connecting to ${networkToConnect.ssid}...`);
          
          let password = null;
          
          if (isElectron()) {
            try {
              const result = await window.api.getPassword(networkToConnect.ssid);
              if (result.success) {
                password = result.password;
              }
            } catch (error) {
              console.error("Error getting password:", error);
            }
          } else {
            password = secureStorage.getPassword(networkToConnect.ssid);
          }
          
          if (password) {
            setTimeout(() => {
              connectToNetwork(networkToConnect.ssid, password);
            }, 1500);
          }
        }
      };
      
      if (networks.length > 0 && !isScanning) {
        tryConnectToSaved();
      }
    };
    
    autoConnect();
  }, [isScanning, networks.length, autoReconnect]);

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
      const checkSavedPassword = async () => {
        let savedPassword = null;
        
        if (isElectron()) {
          try {
            const result = await window.api.getPassword(ssid);
            if (result.success) {
              savedPassword = result.password;
            }
          } catch (error) {
            console.error("Error getting password:", error);
          }
        } else {
          savedPassword = secureStorage.getPassword(ssid);
        }
        
        if (savedPassword) {
          connectToNetwork(ssid, savedPassword);
        } else {
          setShowPasswordDialog(true);
        }
      };
      
      checkSavedPassword();
    } else {
      connectToNetwork(ssid, null);
    }
  };
  
  const connectToNetwork = async (ssid: string, password: string | null) => {
    setConnectingNetwork(ssid);
    setShowPasswordDialog(false);
    
    if (password) {
      if (isElectron()) {
        try {
          await window.api.storePassword(ssid, password);
        } catch (error) {
          console.error("Error storing password:", error);
        }
      } else {
        secureStorage.savePassword(ssid, password);
      }
    }
    
    try {
      if (isElectron()) {
        const result = await window.api.connectToNetwork(ssid, password);
        
        if (result.success) {
          setNetworks(networks => 
            networks.map(network => ({
              ...network,
              connected: network.ssid === ssid ? true : false,
              lastConnected: network.ssid === ssid ? new Date() : network.lastConnected
            }))
          );
          
          toast.success("Connected Successfully", {
            description: `You're now connected to ${ssid}`
          });
        } else {
          toast.error("Connection Failed", {
            description: result.error || `Could not connect to ${ssid}`
          });
        }
      } else {
        setTimeout(() => {
          setNetworks(networks => 
            networks.map(network => ({
              ...network,
              connected: network.ssid === ssid ? true : false,
              lastConnected: network.ssid === ssid ? new Date() : network.lastConnected
            }))
          );
          
          toast.success("Connected Successfully", {
            description: `You're now connected to ${ssid}`
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error connecting to network:", error);
      toast.error("Connection Failed", {
        description: `Could not connect to ${ssid}`
      });
    } finally {
      setConnectingNetwork(null);
    }
  };

  const disconnectFromNetwork = async (ssid: string) => {
    try {
      if (isElectron()) {
        const result = await window.api.disconnectFromNetwork(ssid);
        
        if (result.success) {
          setNetworks(networks => 
            networks.map(network => ({
              ...network,
              connected: network.ssid === ssid ? false : network.connected
            }))
          );
          
          toast("Disconnected", {
            description: `You've disconnected from ${ssid}`
          });
        } else {
          toast.error("Disconnect Failed", {
            description: result.error || `Could not disconnect from ${ssid}`
          });
        }
      } else {
        setNetworks(networks => 
          networks.map(network => ({
            ...network,
            connected: network.ssid === ssid ? false : network.connected
          }))
        );
        
        toast("Disconnected", {
          description: `You've disconnected from ${ssid}`
        });
      }
    } catch (error) {
      console.error("Error disconnecting from network:", error);
      toast.error("Disconnect Failed", {
        description: `Could not disconnect from ${ssid}`
      });
    }
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
