import HomeClient from "./components/homeclient";

async function getAdmins() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/all`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const admins = await getAdmins();
  return <HomeClient admins={admins} />;
}