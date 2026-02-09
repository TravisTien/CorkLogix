import { createContext, useContext, useState, ReactNode } from 'react';
import { User, USERS } from '@/data/mockData';

interface UserContextType {
    currentUser: User;
    switchUser: (userId: string) => void;
    isBusinessConfig: boolean; // Renamed to avoid confusion with isBusiness role check
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User>(USERS[0]);

    const switchUser = (userId: string) => {
        const user = USERS.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
        }
    };

    const isBusinessConfig = currentUser.role === 'sales' || currentUser.role === 'admin';

    return (
        <UserContext.Provider value={{ currentUser, switchUser, isBusinessConfig }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
