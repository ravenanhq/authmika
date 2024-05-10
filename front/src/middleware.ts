export { default } from "next-auth/middleware";
 
export const config = {
  matcher: ["/((?!login|forgot-password|reset-password|create-password|user-activation).*)"],
};