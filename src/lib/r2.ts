import {
  S3Client,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";

export const R2_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  "https://pub-496115bbea2a4b3f98366c8e8938ee11.r2.dev";

export interface R2ImageItem {
  id: string;
  key: string;
  url: string;
  filename: string;
  title: string;
  year: string;
}

// Global cached client instance
let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    const accountId =
      process.env.R2_ACCOUNT_ID || "a3413cb9d2e42dbf046e86cbdd747498";
    const accessKeyId =
      process.env.R2_ACCESS_KEY_ID || "8a495a53dcf1979d696550c08b3b0df7";
    const secretAccessKey =
      process.env.R2_SECRET_ACCESS_KEY ||
      "2cdf305eee8169e0304ce8f49c1705030017668564a317d21ddb66abbbcd2715";

    s3ClientInstance = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
}

/**
 * Safely constructs the public URL for an R2 object key,
 * encoding special characters like spaces.
 */
export function getR2ImageUrl(key: string): string {
  const cleanKey = key.startsWith("/") ? key.slice(1) : key;
  const encodedPath = cleanKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${encodedPath}`;
}

/**
 * Derives a clean, dignified Arabic title from the image filename.
 */
export function formatArabicImageTitle(filename: string, index: number): string {
  const baseName = filename.replace(/\.[^/.]+$/, ""); // strip extension
  const clean = baseName
    .replace(/^Copy of\s+/i, "")
    .replace(/[-_]/g, " ")
    .trim();

  if (/^Casa/i.test(clean)) {
    const num = clean.replace(/[^0-9]/g, "");
    return `توثيق ميداني — الدار البيضاء ${num ? `(${num})` : ""}`.trim();
  }

  if (/^Merakech/i.test(clean)) {
    const num = clean.replace(/[^0-9]/g, "");
    return `توثيق ميداني — مراكش ${num ? `(${num})` : ""}`.trim();
  }

  if (/^Al\s*Fath/i.test(clean)) {
    const num = clean.replace(/.*(\d{3})$/, "$1");
    return `سجل الفتح التوثيقي ${num ? `رقم ${num}` : ""}`.trim();
  }

  if (/^\d+$/.test(clean)) {
    return `وثيقة أرشيفية رقم ${clean}`;
  }

  if (/^CNV\d+/i.test(clean)) {
    const num = clean.replace(/[^0-9]/g, "").replace(/^0+/, "");
    return `سجل المحفوظات رقم ${num || clean}`;
  }

  if (/^IM\d+/i.test(clean)) {
    const num = clean.replace(/[^0-9]/g, "");
    return `لقطة فوتوغرافية رقم ${num || clean}`;
  }

  return `وثيقة أرشيفية #${index + 1}`;
}

/**
 * In-memory cache for fetched year lists to prevent duplicate R2 API calls.
 */
const yearImagesCache = new Map<string, R2ImageItem[]>();

/**
 * Fetches image objects for a given year folder from R2.
 * @param year e.g. "1998", "1999"
 * @param max optional limit, e.g. 5 for home page
 */
export async function fetchYearImagesFromR2(
  year: string,
  max?: number
): Promise<R2ImageItem[]> {
  const cacheKey = `year-${year}`;

  if (yearImagesCache.has(cacheKey)) {
    const cached = yearImagesCache.get(cacheKey)!;
    return typeof max === "number" ? cached.slice(0, max) : cached;
  }

  const bucketName = process.env.R2_BUCKET_NAME || "archive-media";
  const s3 = getS3Client();

  try {
    let isTruncated = true;
    let continuationToken: string | undefined = undefined;
    const allItems: R2ImageItem[] = [];

    while (isTruncated) {
      const res: ListObjectsV2CommandOutput = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          Prefix: `event/${year}/`,
          ContinuationToken: continuationToken,
        })
      );

      const contents = res.Contents || [];
      for (const obj of contents) {
        if (!obj.Key) continue;
        const lowerKey = obj.Key.toLowerCase();
        // Ignore folder markers and non-image files (.db, .DS_Store, etc.)
        if (
          lowerKey.endsWith("/") ||
          lowerKey.endsWith(".db") ||
          lowerKey.includes("thumbs")
        ) {
          continue;
        }

        // Only include standard image formats
        if (
          !lowerKey.endsWith(".jpg") &&
          !lowerKey.endsWith(".jpeg") &&
          !lowerKey.endsWith(".png") &&
          !lowerKey.endsWith(".webp")
        ) {
          continue;
        }

        const segments = obj.Key.split("/");
        const filename = segments[segments.length - 1];
        const id = `r2-${year}-${allItems.length + 1}`;
        const url = getR2ImageUrl(obj.Key);
        const title = formatArabicImageTitle(filename, allItems.length);

        allItems.push({
          id,
          key: obj.Key,
          url,
          filename,
          title,
          year,
        });
      }

      isTruncated = Boolean(res.IsTruncated);
      continuationToken = res.NextContinuationToken;
    }

    yearImagesCache.set(cacheKey, allItems);
    return typeof max === "number" ? allItems.slice(0, max) : allItems;
  } catch (error) {
    console.warn(`[R2] Could not fetch images for year ${year}:`, error);
    return [];
  }
}
