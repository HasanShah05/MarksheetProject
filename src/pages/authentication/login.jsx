import { useState, useEffect } from "react";
import { TextInput, PasswordInput, Button, Paper, Title } from "@mantine/core";

function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  useEffect(() => {
    const users = [
      { email: "admin@gmail.com", password: "123", role: "teacher" },
      { email: "student@gmail.com", password: "123", role: "student" },
    ];

    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.reload();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center" }}>
        <h1>Marksheet </h1>
      <Paper p="xl" shadow="xl" withBorder style={{ width: 350 }}>
        <Title order={3} mb="md">Login</Title>

        <TextInput
        withAsterisk
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
        withAsterisk
          label="Password"
          mt="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth mt="lg" onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </div>
  );
}

export default Login;