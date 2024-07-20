"use client";
import { Container, listItemButtonClasses } from "@mui/material";
import ApplicationList from "@/components/Applications/ApplicationList";

export default function Application() {
  const GET_ALL = 'all';
  return (
    <Container  maxWidth="xl">
      <ApplicationList title={true} get={GET_ALL} userId={undefined}isAdd={true} />
    </Container>
  );
}
