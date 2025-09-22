
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Heart, 
  FileText, 
  User, 
  Plus,
  Utensils,
  Stethoscope,
  Hammer,
  Building,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User as UserEntity } from "@/entities/User";
import { Barn } from "@/entities/Barn";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Horses", url: createPageUrl("Horses"), icon: Heart },
  { title: "Training Logs", url: createPageUrl("TrainingLogs"), icon: FileText },
  { title: "Feeding", url: createPageUrl("FeedingSchedules"), icon: Utensils },
  { title: "Veterinary", url: createPageUrl("VeterinaryRecords"), icon: Stethoscope },
  { title: "Shoeing", url: createPageUrl("ShoeingRecords"), icon: Hammer },
  { title: "Profile", url: createPageUrl("Profile"), icon: User },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [currentBarn, setCurrentBarn] = React.useState(null);
  const [userBarns, setUserBarns] = React.useState([]);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await UserEntity.me();
        setUser(currentUser);

        // Load current barn info
        if (currentUser.current_barn_id) {
          const barns = await Barn.list();
          const barn = barns.find(b => b.id === currentUser.current_barn_id);
          setCurrentBarn(barn);

          // Load user's associated barns for switching
          if (currentUser.associated_barns) {
            const associatedBarns = barns.filter(b => currentUser.associated_barns.includes(b.id));
            setUserBarns(associatedBarns);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const handleBarnSwitch = async (barnId) => {
    try {
      await UserEntity.updateMyUserData({ current_barn_id: barnId });
      window.location.reload(); // Refresh to load data for new barn
    } catch (error) {
      console.error("Error switching barn:", error);
    }
  };

  // If no barn selected, don't show the sidebar
  if (!user?.current_barn_id) {
    return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <style>
          {`
            :root {
              --primary: 120 38% 34%;
              --primary-foreground: 0 0% 98%;
              --secondary: 30 25% 85%;
              --secondary-foreground: 30 25% 15%;
              --accent: 25 100% 95%;
              --accent-foreground: 25 100% 10%;
              --muted: 30 25% 95%;
              --muted-foreground: 30 25% 35%;
              --border: 30 25% 88%;
              --ring: 120 38% 34%;
            }
          `}
        </style>
        
        <Sidebar className="border-r border-amber-200 bg-gradient-to-b from-white to-amber-50/30">
          <SidebarHeader className="border-b border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">EquineTracker</h2>
                <p className="text-xs text-amber-700 font-medium">Professional Horse Management</p>
              </div>
            </div>
            
            {/* Barn Selector */}
            {userBarns.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Current Barn</label>
                <Select value={user.current_barn_id} onValueChange={handleBarnSwitch}>
                  <SelectTrigger className="w-full border-amber-200">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span className="truncate">{currentBarn?.name || 'Select Barn'}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {userBarns.map((barn) => (
                      <SelectItem key={barn.id} value={barn.id}>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          <span>{barn.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Current Barn Info */}
            {currentBarn && userBarns.length <= 1 && (
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-gray-900 text-sm">{currentBarn.name}</span>
                </div>
                <p className="text-xs text-amber-700">{currentBarn.location}</p>
              </div>
            )}

            {/* Barn Selection Link */}
            <div className="mt-3">
              <Link to={createPageUrl("BarnSelection")}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 text-xs"
                >
                  <Building className="w-3 h-3 mr-2" />
                  Switch Barn
                </Button>
              </Link>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-amber-800 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-amber-100 hover:text-amber-900 transition-all duration-200 rounded-xl ${
                          (location.pathname === item.url || (item.url !== createPageUrl("Dashboard") && location.pathname.startsWith(item.url)))
                            ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 shadow-sm border border-amber-200' 
                            : 'text-gray-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-amber-800 uppercase tracking-wider px-3 py-2">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 space-y-2">
                  <Link to={createPageUrl("AddHorse")}>
                    <Button variant="outline" className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Plus className="w-4 h-4 mr-2" /> Add Horse
                    </Button>
                  </Link>
                  <Link to={createPageUrl("AddTrainingLog")}>
                    <Button variant="outline" className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <FileText className="w-4 h-4 mr-2" /> Log Training
                    </Button>
                  </Link>
                   <Link to={createPageUrl("AddFeedingSchedule")}>
                    <Button variant="outline" className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Utensils className="w-4 h-4 mr-2" /> Add Feeding
                    </Button>
                  </Link>
                   <Link to={createPageUrl("AddVetVisit")}>
                    <Button variant="outline" className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Stethoscope className="w-4 h-4 mr-2" /> Add Vet Visit
                    </Button>
                  </Link>
                  <Link to={createPageUrl("AddShoeingRecord")}>
                    <Button variant="outline" className="w-full justify-start border-amber-300 text-amber-700 hover:bg-amber-50">
                      <Hammer className="w-4 h-4 mr-2" /> Add Shoeing
                    </Button>
                  </Link>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-amber-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-amber-700 truncate">
                  {user?.role || 'Loading...'}
                </p>
              </div>
              <Link to={createPageUrl("BarnSelection")}>
                <Button variant="ghost" size="icon" className="text-amber-700 hover:bg-amber-100">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-amber-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">EquineTracker</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
