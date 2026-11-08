import { getTimelineEventsWithR2Images } from "@/lib/timelineData";
import { MinimalTimeline } from "@/components/timeline/MinimalTimeline";

export const revalidate = 3600; // revalidate every hour

export default async function Home() {
  // Fetch max 5 images for each year from Cloudflare R2
  const events = await getTimelineEventsWithR2Images(5);

  return (
    <main className="min-h-screen min-w-full overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200">
      <MinimalTimeline events={events} />
    </main>
  );
}
