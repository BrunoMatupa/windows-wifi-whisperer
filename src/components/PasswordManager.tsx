
import React, { useState } from 'react';
import { secureStorage } from '@/utils/secureStorage';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from "sonner";

interface PasswordManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordManager: React.FC<PasswordManagerProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPin, setUserPin] = useState("");
  const [savedPasswords, setSavedPasswords] = useState<{ssid: string, password: string, visible: boolean}[]>([]);
  
  // Simple PIN for demo purposes
  const correctPin = "1234"; // In a real app, this would be securely stored/verified
  
  const handleAuthenticate = () => {
    if (userPin === correctPin) {
      setIsAuthenticated(true);
      loadSavedPasswords();
      toast.success("Authentication successful");
    } else {
      toast.error("Incorrect PIN");
    }
  };
  
  const loadSavedPasswords = () => {
    const allPasswords = secureStorage.getAllPasswords();
    setSavedPasswords(allPasswords.map(p => ({
      ssid: p.ssid,
      password: secureStorage.getPassword(p.ssid) || "",
      visible: false
    })));
  };
  
  const togglePasswordVisibility = (index: number) => {
    setSavedPasswords(passwords => 
      passwords.map((p, i) => 
        i === index ? { ...p, visible: !p.visible } : p
      )
    );
  };
  
  const deletePassword = (ssid: string) => {
    secureStorage.deletePassword(ssid);
    setSavedPasswords(passwords => passwords.filter(p => p.ssid !== ssid));
    toast.success(`Password for ${ssid} deleted`);
  };
  
  const handleClose = () => {
    setIsAuthenticated(false);
    setUserPin("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Saved WiFi Passwords</DialogTitle>
          <DialogDescription>
            {!isAuthenticated 
              ? "Enter your PIN to view saved passwords." 
              : "Your saved WiFi network passwords."}
          </DialogDescription>
        </DialogHeader>
        
        {!isAuthenticated ? (
          <div className="py-4 space-y-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
              maxLength={4}
              className="text-center text-xl tracking-widest"
            />
            <Button 
              onClick={handleAuthenticate}
              className="w-full"
              disabled={userPin.length !== 4}
            >
              Authenticate
            </Button>
          </div>
        ) : (
          <div className="py-4 max-h-[400px] overflow-y-auto space-y-3">
            {savedPasswords.length === 0 ? (
              <p className="text-center text-muted-foreground">No saved passwords</p>
            ) : (
              savedPasswords.map((item, index) => (
                <div key={item.ssid} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">{item.ssid}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground font-mono">
                        {item.visible ? item.password : '••••••••'}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePasswordVisibility(index)}
                      >
                        {item.visible ? 
                          <EyeOff className="h-3 w-3" /> : 
                          <Eye className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePassword(item.ssid)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {isAuthenticated && (
            <Button variant="destructive" onClick={() => setSavedPasswords([])}>
              Clear All
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordManager;
