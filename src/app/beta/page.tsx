import { redirect } from "next/navigation";
import { betaMember } from "@/lib/beta/supabase";
import FeedbackForm from "./feedback-form";

export default async function BetaPage() {
  const member = await betaMember().catch(() => null);
  if (!member) redirect("/beta/login");
  return <main><h1 className="text-3xl font-bold">Private playtest</h1><p className="mt-4">The character app is not connected yet. This page is an access and feedback prototype.</p><FeedbackForm /></main>;
}
