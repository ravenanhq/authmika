"use client";
import { Container } from "@mui/material";
import GroupList from "@/components/Groups/GroupList";

export default function GroupPage() {
  const GET_ALL = 'all';
  return (
    <Container maxWidth="xl">
      {/* <GroupList title={true} userId={undefined} get={GET_ALL} isCreate={true}/> */}
      <GroupList/>
    </Container>
  );
}