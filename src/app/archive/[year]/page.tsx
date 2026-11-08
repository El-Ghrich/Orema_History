import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARCHIVE_GALLERY_BY_YEAR } from "@/data/archiveGallery";
import { getYearGalleryWithR2Images } from "@/lib/timelineData";
import { YearGalleryClient } from "@/components/gallery/YearGalleryClient";

interface PageProps {
  params: Promise<{ year: string }>;
}

const ALL_YEARS = Object.keys(ARCHIVE_GALLERY_BY_YEAR);

export function generateStaticParams() {
  return ALL_YEARS.map((year) => ({ year }));
}

export const revalidate = 3600; // revalidate every hour

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { year } = await params;
  const gallery = ARCHIVE_GALLERY_BY_YEAR[year];

  if (!gallery) {
    return {
      title: "أرشيف العام غير موجود | الأرشيف",
    };
  }

  return {
    title: `أرشيف عام ${year} — ${gallery.title} | الأرشيف`,
    description: gallery.description,
  };
}

export default async function YearArchivePage({ params }: PageProps) {
  const { year } = await params;
  // Fetch ALL images of that year's folder from Cloudflare R2
  const gallery = await getYearGalleryWithR2Images(year);

  if (!gallery) {
    notFound();
  }

  return <YearGalleryClient galleryInfo={gallery} allYears={ALL_YEARS} />;
}
