"use client";
import { Container, listItemButtonClasses } from "@mui/material";
import ApplicationList from "@/components/Applications/ApplicationList";

export default function Application() {
  return (
    <Container  maxWidth="xl">
      <ApplicationList />
    </Container>
  );
}
