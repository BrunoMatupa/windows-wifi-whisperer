
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, WifiOff, Settings, Key } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

import WiFiHeader from '@/components/WiFiHeader';
import NetworkList from '@/components/NetworkList';
import ConnectionDetails from '@/components/ConnectionDetails';
import PasswordDialog from '@/components/PasswordDialog';
import PasswordManager from '@/components/PasswordManager';
import useWifiNetworks from '@/hooks/useWifiNetworks';

const Index = () => {
  const {
    networks,
    isScanning,
    scanNetworks,
    toggleFavorite,
    initiateConnect,
    connectToNetwork,
    selectedNetwork,
    showPasswordDialog,
    setShowPasswordDialog,
    connectingNetwork,
    autoReconnect,
    toggleAutoReconnect
  } = useWifiNetworks();

  const [showPasswords, setShowPasswords] = useState(false);
  const [showPasswordManager, setShowPasswordManager] = useState(false);
  
  const connectedNetwork = networks.find(network => network.connected) || null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <WiFiHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Available Networks</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={scanNetworks}
                  disabled={isScanning}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning ? 'Scanning...' : 'Scan'}
                </Button>
              </div>

              {networks.length === 0 && !isScanning ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <WifiOff className="h-12 w-12 mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-1">No Networks Found</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Make sure your WiFi adapter is enabled
                  </p>
                  <Button variant="outline" onClick={scanNetworks}>
                    Scan Again
                  </Button>
                </div>
              ) : (
                <NetworkList 
                  networks={networks}
                  onConnect={initiateConnect}
                  onToggleFavorite={toggleFavorite}
                  isScanning={isScanning}
                />
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <ConnectionDetails network={connectedNetwork} />

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Settings</h3>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Auto-connect to favorites</span>
                    <input 
                      type="checkbox" 
                      checked={autoReconnect}
                      onChange={toggleAutoReconnect}
                      className="toggle" 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show password</span>
                    <input 
                      type="checkbox"
                      checked={showPasswords}
                      onChange={() => setShowPasswords(!showPasswords)}
                      className="toggle" 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Auto-scan networks</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => setShowPasswordManager(true)}
                  >
                    <Key className="h-4 w-4" />
                    Manage Saved Passwords
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <PasswordDialog
          isOpen={showPasswordDialog}
          networkName={selectedNetwork?.ssid || ''}
          onClose={() => setShowPasswordDialog(false)}
          onConnect={(password) => {
            if (selectedNetwork) {
              connectToNetwork(selectedNetwork.ssid, password);
            }
          }}
        />
        
        <PasswordManager
          isOpen={showPasswordManager}
          onClose={() => setShowPasswordManager(false)}
        />

        {/* Modal for connecting state */}
        {connectingNetwork && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <Card className="w-80 p-4">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="h-10 w-10 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
                <p className="text-center">
                  Connecting to <strong>{connectingNetwork}</strong>...
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Windows WiFi Whisperer &copy; 2025</p>
          <p className="text-xs mt-1 mb-2">
            For demonstration purposes only.
            In a real-world implementation, this app would interact with Windows APIs.
          </p>
          <p className="text-sm font-medium">
            Created by Bruno Matutu | A brilliant idea brought to life
          </p>
        </footer>

        <Toaster />
      </div>
    </div>
  );
};

export default Index;
