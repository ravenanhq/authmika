"use client";
import { Container } from "@mui/material";
import GroupList from "@/components/Groups/GroupList";

export default function GroupPage() {
  return (
    <Container maxWidth="xl">
      <GroupList />
    </Container>
  );
}