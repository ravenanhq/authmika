import Link from "next/link";

const HomePage = () => {
  return (
    <div>
    <h1>Welcome to My App</h1>
    <p>Explore user profiles:</p>
    <Link href="/profile/[username]" as="/profile/johndoe">
    <a>Visit John Doe&apos;s Profile</a>
    </Link>
    <br />
    <Link href="/profile/[username]" as="/profile/janedoe">
    <a>Visit John Doe&#39;s Profile</a>
    </Link>
  </div>
);
};


export default HomePage;
