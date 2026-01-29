import { useState, useEffect } from "react";

const USERS_KEY = "cinetech_users";
const CURRENT_USER_KEY = "cinetech_current_user";

const getStoredUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getStoredCurrentUser = () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

export function useAuth() {
    const [user, setUser] = useState(getStoredCurrentUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Synchroniser l'état avec localStorage et écouter les changements
    useEffect(() => {
        const syncUser = () => {
            setUser(getStoredCurrentUser());
        };

        syncUser();

        // créer un event listener pour les changements d'authentification pour l'affichage du bouton deconnexion
        window.addEventListener("auth-change", syncUser);

        return () => {
            window.removeEventListener("auth-change", syncUser);
        };
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const users = getStoredUsers();
            const foundUser = users.find(
                (u) => u.email === email && u.password === password
            );

            if (!foundUser) {
                throw new Error("Email ou mot de passe incorrect");
            }

            // Ne pas exposer le mot de passe dans le localstorage
            const { password: _, ...userWithoutPassword } = foundUser;
            
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
            setUser(userWithoutPassword);
            
            window.dispatchEvent(new Event("auth-change"));
            
            return { success: true, user: userWithoutPassword };
        } catch (err) {
            setError(err.message || "Erreur lors de la connexion");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async ({ email, password, name }) => {
        setLoading(true);
        setError(null);
        try {
            const users = getStoredUsers();
            
            // Vérifier si l'email existe déjà
            const existingUser = users.find((u) => u.email === email);
            if (existingUser) {
                throw new Error("Cet email est déjà utilisé");
            }

            // Créer le nouvel utilisateur
            const newUser = {
                id: Date.now().toString(),
                email,
                password,
                name: name || email.split("@")[0],
                createdAt: new Date().toISOString(),
            };

            // Sauvegarder dans la liste des utilisateurs
            users.push(newUser);
            saveUsers(users);

            // Connecter automatiquement après l'inscription
            const { password: _, ...userWithoutPassword } = newUser;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
            setUser(userWithoutPassword);

            window.dispatchEvent(new Event("auth-change"));

            return { success: true, user: userWithoutPassword };
        } catch (err) {
            setError(err.message || "Erreur lors de l'inscription");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        setUser(null);
        setError(null);
        window.dispatchEvent(new Event("auth-change"));
    };

    const isAuthentificated = () => {
        return user !== null;
    };

    return { 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout, 
        isAuthentificated,
        setError 
    };
}