import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "./AA-InputForm";
import { useAuth } from "../hooks/useAuth";

/**
 * AuthForm - Formulaire réutilisable pour Connexion et Inscription
 *
 * @param {string} mode - "login" ou "register" pour définir le type de formulaire
 */
export default function AuthForm({ mode = "login" }) {
    const isLogin = mode === "login";
    const navigate = useNavigate();
    const { user, login, register, loading, logout, isAuthentificated, error: authError, setError } = useAuth();

    // State pour les valeurs des champs
    const [value, setValue] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // State pour les erreurs de validation
    const [error, setFormError] = useState({});

    // Redirection si déjà connecté


    // Réinitialiser les erreurs auth quand on change de mode
    useEffect(() => {
        setError(null);
    }, [mode, setError]);

    // Validation du formulaire
    const validateForm = () => {
        const newErrors = {};

        // Validation du nom d'utilisateur (inscription uniquement)
        if (!isLogin && !value.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est requis";
        }

        // Validation de l'email
        if (!value.email.includes("@")) {
            newErrors.email = `Votre email est incorrect : ${value.email}`;
        }

        // Validation du mot de passe
        if (value.password.length < 6) {
            newErrors.password = "Votre mot de passe doit contenir au moins 6 caractères";
        }

        // Validation de la confirmation du mot de passe (inscription uniquement)
        if (!isLogin && value.password !== value.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        }

        setFormError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Fonction appelée lors de la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Réinitialise les erreurs avant validation
        setFormError({});

        if (!validateForm()) {
            return;
        }

        let result;
        if (isLogin) {
            result = await login(value.email, value.password);
        } else {
            result = await register({
                name: value.username,
                email: value.email,
                password: value.password
            });
        }

        // Redirection après succès (force un vrai refresh pour mettre à jour le Header)
        if (result?.success) {
            navigate("/");
        }
    };

    // Fonction de déconnexion
    const handleLogout = () => {
        logout();
    };

    // Fonction générique pour mettre à jour les valeurs
    const handleChange = (field) => (e) => {
        setValue((prev) => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    // Si l'utilisateur est déjà connecté, afficher un message
    if (isAuthentificated()) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Bienvenue, {user?.name || user?.email} !
                    </h1>
                    <p className="text-gray-400 mb-6">
                        Vous êtes déjà connecté.
                    </p>
                    <div className="space-y-3">
                        <Link
                            to="/"
                            className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors"
                        >
                            Aller à l'accueil
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-white text-center mb-6">
                    {isLogin ? "Connexion" : "Inscription"}
                </h1>

                {/* Affichage de l'erreur d'authentification */}
                {authError && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
                        {authError}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Champ nom d'utilisateur (inscription uniquement) */}
                    {!isLogin && (
                        <InputForm
                            label="Nom d'utilisateur"
                            name="username"
                            type="text"
                            placeholder="Votre nom d'utilisateur"
                            onChange={handleChange("username")}
                            value={value.username}
                            error={error.username}
                        />
                    )}

                    {/* Champ email */}
                    <InputForm
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Votre email"
                        onChange={handleChange("email")}
                        value={value.email}
                        error={error.email}
                    />

                    {/* Champ mot de passe */}
                    <InputForm
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="Votre mot de passe"
                        onChange={handleChange("password")}
                        value={value.password}
                        error={error.password}
                    />

                    {/* Champ confirmation mot de passe (inscription uniquement) */}
                    {!isLogin && (
                        <InputForm
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirmer votre mot de passe"
                            onChange={handleChange("confirmPassword")}
                            value={value.confirmPassword}
                            error={error.confirmPassword}
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-2 rounded transition-colors"
                    >
                        {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-4">
                    {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                    <Link
                        to={isLogin ? "/inscription" : "/connexion"}
                        className="text-purple-500 hover:text-purple-400"
                    >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </Link>
                </p>

                <p className="text-gray-400 text-center mt-2">
                    <Link to="/" className="text-gray-500 hover:text-gray-300">
                        Retour à l'accueil
                    </Link>
                </p>
            </div>
        </div>
    );
}
