"use client";
import Container from "@mui/material/Container";
import LoginForm from "@/components/Login/LoginForm";

export default function SignIn() {
  return (
    <Container component="div" maxWidth="xs">
      <LoginForm />
    </Container>
  );
}
