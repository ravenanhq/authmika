"use client";
import { Container } from "@mui/material";
import RoleList from "@/components/Role/RoleList";

export default function RolePage() {
  return (
    <Container maxWidth="xl">
      <RoleList />
    </Container>
  );
}