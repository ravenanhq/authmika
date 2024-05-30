"use client";
import { Container } from "@mui/material";
import RolesList from "@/components/Roles/RolesList";

export default function RolesPage() {
  return (
    <Container maxWidth="xl">
      <RolesList />
    </Container>
  );
}