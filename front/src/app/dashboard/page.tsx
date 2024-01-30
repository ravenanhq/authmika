"use client";
import styles from "../page.module.css";
import { signOut } from "next-auth/react";
import { Button } from "@mui/material";

export default function Home() {
  const logOut = () => {
    signOut({ redirect: true, callbackUrl: "http://localhost:3000/login" });
  };
  return (
    <main className={styles.main}>
      <h1>Dashboard</h1>
      <Button variant="contained" onClick={() => logOut()}>
        Logout
      </Button>
    </main>
  );
}
