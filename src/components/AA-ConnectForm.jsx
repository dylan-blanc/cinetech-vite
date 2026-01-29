import { useState } from "react";
import InputForm from "./AA-InputForm";

export default function ConnectForm() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [value, setValue] = useState({ email: "", password: "" });
  const [error, setError] = useState({});

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = (e) => {
    setError({ Email: "", Password: "" });
    //Empêche le comportement par défaut du formulaire
    e.preventDefault();

    if (!value.email.includes("@")) {
      setError((prev) => ({
        ...prev,
        Email: `Votre email est incorrect : ${value.email}`,
      }));
    }

    if (value.password.length < 6) {
      setError((prev) => ({
        ...prev,
        Password:
          "Votre mot de passe ne contient pas le nombre de caractères requis",
      }));
    }

    // Affiche dans la console les données saisies par l'utilisateur
    // Ces valeurs proviennent généralement du state (useState)
    console.log({
      email: value.email,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputForm
          label="email"
          onChange={(e) =>
            setValue((prev) => ({ ...prev, email: e.target.value }))
          }
          value={value.email}
          error={error.Email}
        />
        <InputForm
          label="password"
          type="password"
          placeholder="Entre ton"
          onChange={(e) =>
            setValue((prev) => ({ ...prev, password: e.target.value }))
          }
          value={value.password}
          error={error.Password}
        />

        <button type="submit">Enoyer</button>
      </form>
    </>
  );
}
