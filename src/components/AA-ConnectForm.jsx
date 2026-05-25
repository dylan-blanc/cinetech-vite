import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputForm from "./AA-InputForm";
import { useAuth } from "../hooks/useAuth";

const Minimum_Character = 3;

/*
* regex email permissive 
* pas d'espace ou double @, un caractere requis avant et apres le @
*/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+$/i;

/*  
* explication regex dans l'ordre : il faut au moins une majuscule, un chiffre
*  tous sauf lettre/chiffre/espace et au moins 6 caractere
* (pour valider la regex, pas d'ordre défini pour le mdp)
*/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{6,}$/;

/**
 * AuthForm - Formulaire réutilisable pour Connexion et Inscription
 *
 * @param {string} mode - "login" ou "register" pour définir le type de formulaire
 */
export default function AuthForm({ mode = "login" }) {
  return <AuthFormInner key={mode} mode={mode} />;
}

function AuthFormInner({ mode = "login" }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const {
    user,
    login,
    register,
    loading,
    logout,
    isAuthentificated,
    error: authError,
    setError,
  } = useAuth();

  // State pour les valeurs des champs
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State pour les erreurs de validation
  const [formErrors, setFormErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Réinitialiser les erreurs auth quand on change de mode
  useEffect(() => {
    setError(null);
  }, [mode, setError]);

  const shouldShowLiveError = (fieldValue, force = false) => {
    if (force) return true;
    return (fieldValue ?? "").length >= Minimum_Character;
  };

  const getFieldError = (field, nextValues, { force = false } = {}) => {
    const fieldValue = nextValues[field] ?? "";

    if (!shouldShowLiveError(fieldValue, force)) {
      return null;
    }

    switch (field) {
      case "username":
        if (isLogin) return null;
        return nextValues.username.trim()
          ? null
          : "Le nom d'utilisateur est requis";

      case "email":
        if (!nextValues.email) return "L'email est requis";
        return EMAIL_REGEX.test(nextValues.email)
          ? null
          : `Votre email est incorrect : ${nextValues.email}`;

      case "password":
        if (!nextValues.password) return "Le mot de passe est requis";
        return PASSWORD_REGEX.test(nextValues.password)
          ? null
          : "Mot de passe invalide (6 min, 1 majuscule, 1 chiffre, 1 caractère spécial)";

      case "confirmPassword":
        if (isLogin) return null;
        if (!nextValues.confirmPassword)
          return "Veuillez confirmer votre mot de passe";
        return nextValues.confirmPassword === nextValues.password
          ? null
          : "Les mots de passe ne correspondent pas";

      default:
        return null;
    }
  };

  const validateAll = (nextValues) => {
    const fields = isLogin
      ? ["email", "password"]
      : ["username", "email", "password", "confirmPassword"];

    const nextErrors = {};
    for (const field of fields) {
      const message = getFieldError(field, nextValues, { force: true });
      if (message) nextErrors[field] = message;
    }
    return nextErrors;
  };

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    setHasSubmitted(true);

    const nextErrors = validateAll(values);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    let result;
    if (isLogin) {
      result = await login(values.email, values.password);
    } else {
      result = await register({
        name: values.username,
        email: values.email,
        password: values.password,
      });
    }

    // Redirection après succès (force un vrai refresh pour mettre à jour le Header)
    if (result?.success) {
      navigate("/");
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => logout();

  // Fonction générique pour mettre à jour les valeurs
  const handleChange = (field) => (e) => {
    const nextValues = {
      ...values,
      [field]: e.target.value,
    };

    setValues(nextValues);

    // Si l'utilisateur retape après une erreur d'auth, on la masque.
    if (authError) setError(null);

    setFormErrors((prev) => {
      const force = hasSubmitted;
      const next = { ...prev };

      const updateField = (fieldToUpdate) => {
        const message = getFieldError(fieldToUpdate, nextValues, { force });
        if (message) next[fieldToUpdate] = message;
        else delete next[fieldToUpdate];
      };

      updateField(field);

      // Si le mot de passe change, on revalide la confirmation.
      if (!isLogin && field === "password") {
        updateField("confirmPassword");
      }

      return next;
    });
  };

  // Si l'utilisateur est déjà connecté, afficher un message
  if (isAuthentificated()) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Bienvenue, {user?.name || user?.email} !
          </h1>
          <p className="text-gray-400 mb-6">Vous êtes déjà connecté.</p>
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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1a1a1a" }}
    >
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
              value={values.username}
              error={formErrors.username}
            />
          )}

          {/* Champ email */}
          <InputForm
            label="Email"
            name="email"
            type="email"
            placeholder="Votre email"
            onChange={handleChange("email")}
            value={values.email}
            error={formErrors.email}
          />

          {/* Champ mot de passe */}
          <InputForm
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            onChange={handleChange("password")}
            value={values.password}
            error={formErrors.password}
          />

          {/* Champ confirmation mot de passe (inscription uniquement) */}
          {!isLogin && (
            <InputForm
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              placeholder="Confirmer votre mot de passe"
              onChange={handleChange("confirmPassword")}
              value={values.confirmPassword}
              error={formErrors.confirmPassword}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-2 rounded transition-colors"
          >
            {loading
              ? "Chargement..."
              : isLogin
                ? "Se connecter"
                : "S'inscrire"}
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
