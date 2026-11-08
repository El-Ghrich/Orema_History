import { timelineEvents, TimelineEvent, StackCard, TimelineMedia } from "@/data/events";
import { ARCHIVE_GALLERY_BY_YEAR, YearGalleryInfo } from "@/data/archiveGallery";
import { fetchYearImagesFromR2 } from "@/lib/r2";
import { MasonryItem } from "@/components/ui/Masonry";

/**
 * Enriches the timeline events with up to `maxImages` (e.g. 5)
 * direct Cloudflare R2 images from the bucket for the Home page.
 */
export async function getTimelineEventsWithR2Images(
  maxImagesPerYear: number = 5
): Promise<TimelineEvent[]> {
  const enrichedEvents = await Promise.all(
    timelineEvents.map(async (event) => {
      try {
        const r2Images = await fetchYearImagesFromR2(
          event.year,
          maxImagesPerYear
        );

        if (!r2Images || r2Images.length === 0) {
          // If no R2 folder exists (e.g. year 2000), keep baseline curated images
          return event;
        }

        const stackCards: StackCard[] = r2Images.map((img, idx) => ({
          id: `card-${event.year}-r2-${idx + 1}`,
          title: img.title,
          subtitle: `وثيقة أصلية من محفوظات عام ${event.year} (${img.filename})`,
          image: img.url,
          tag: idx === 0 ? "الوثيقة الرئيسية" : `وثيقة أرشيفية #${idx + 1}`,
        }));

        const media: TimelineMedia[] = r2Images.map((img, idx) => ({
          id: `media-${event.year}-r2-${idx + 1}`,
          type: "image",
          url: img.url,
          caption: `${img.title} — من سجلات عام ${event.year} بـ ${event.location}`,
          aspectRatio: idx % 2 === 0 ? "wide" : "square",
        }));

        const previewImages = r2Images.slice(1).map((img) => img.url);

        return {
          ...event,
          coverImage: r2Images[0].url,
          previewImages: previewImages.length > 0 ? previewImages : event.previewImages,
          stackCards,
          media,
        };
      } catch (err) {
        console.warn(`Fallback to default images for year ${event.year}:`, err);
        return event;
      }
    })
  );

  return enrichedEvents;
}

/**
 * Fetches all images from the R2 folder for a specific year
 * to display in the full Masonry gallery page.
 */
export async function getYearGalleryWithR2Images(
  year: string
): Promise<YearGalleryInfo | null> {
  const baseMeta = ARCHIVE_GALLERY_BY_YEAR[year];
  if (!baseMeta) return null;

  try {
    const allR2Images = await fetchYearImagesFromR2(year);

    if (!allR2Images || allR2Images.length === 0) {
      // Fallback to baseline curated images if folder is not present
      return baseMeta;
    }

    const masonryItems: MasonryItem[] = allR2Images.map((img, idx) => ({
      id: img.id,
      img: img.url,
      title: img.title,
      description: `${baseMeta.location} • وثيقة رقم ${idx + 1} (${img.filename})`,
      url: img.url,
      // Natural varied dimensions to create a rich Masonry layout
      width: 800 + ((idx * 3) % 4) * 150,
      height: 700 + ((idx * 7) % 5) * 120,
    }));

    return {
      ...baseMeta,
      items: masonryItems,
    };
  } catch (err) {
    console.warn(`Fallback to default gallery for year ${year}:`, err);
    return baseMeta;
  }
}

