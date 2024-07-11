"use client";
import Container from "@mui/material/Container";
import UserList from "@/components/User/UserList";

export default function User() {
  return (
    <Container component="div" maxWidth="xl">
      <UserList title={true} isListPage={true} isView={true} role={true} status={true}/>
    </Container>
  );
}




