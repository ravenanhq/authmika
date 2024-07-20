"use client";
import Container from "@mui/material/Container";
import UserList from "@/components/User/UserList";

export default function User() {
  return (
    <Container component="div" maxWidth="xl">
      <UserList title={true} isListPage={true} isView={true} applicationId={undefined} id={undefined} roleView={false} showRole={true} roleId={undefined} roleName={undefined} groupId={undefined} groupView={false} showGroup={true} groupName={undefined} isGroup={false}/>
    </Container>
  );
}




