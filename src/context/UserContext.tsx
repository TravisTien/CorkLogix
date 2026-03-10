import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, USERS } from '@/data/mockData';

interface UserContextType {
    currentUser: User | null;
    login: (id: string, password?: string) => boolean;
    logout: () => void;
    isBusinessConfig: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const AUTH_KEY = 'corklogix_auth_user_id';

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial load from local storage
    useEffect(() => {
        const storedUserId = localStorage.getItem(AUTH_KEY);
        if (storedUserId) {
            const user = USERS.find(u => u.id === storedUserId);
            if (user) {
                setCurrentUser(user);
            } else {
                localStorage.removeItem(AUTH_KEY);
            }
        }
        setIsInitialized(true);
    }, []);

    const login = (userId: string, password?: string) => {
        const user = USERS.find(u => u.id === userId);

        // Very basic mock authentication
        if (user && user.password === password) {
            setCurrentUser(user);
            localStorage.setItem(AUTH_KEY, user.id);
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(AUTH_KEY);
    };

    const isBusinessConfig = currentUser?.role === 'sales' || currentUser?.role === 'admin';

    // Prevent rendering children until we've checked local storage
    if (!isInitialized) return null;

    return (
        <UserContext.Provider value={{ currentUser, login, logout, isBusinessConfig }}>
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
