import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const unsplashPhotos = sqliteTable("photos", {
  photoId: text("photo_id").primaryKey(),
  photoUrl: text("photo_url"),
  photoImageUrl: text("photo_image_url"),
  photoSubmittedAt: text("photo_submitted_at"),
  photoFeatured: integer("photo_featured", { mode: "boolean" }),
  photoWidth: integer("photo_width"),
  photoHeight: integer("photo_height"),
  photoAspectRatio: real("photo_aspect_ratio"),
  photoDescription: text("photo_description"),
  photographerUsername: text("photographer_username"),
  photographerFirstName: text("photographer_first_name"),
  photographerLastName: text("photographer_last_name"),
  exifCameraMake: text("exif_camera_make"),
  exifCameraModel: text("exif_camera_model"),
  exifIso: integer("exif_iso"),
  exifApertureValue: text("exif_aperture_value"),
  exifFocalLength: text("exif_focal_length"),
  exifExposureTime: text("exif_exposure_time"),
  photoLocationName: text("photo_location_name"),
  photoLocationLatitude: real("photo_location_latitude"),
  photoLocationLongitude: real("photo_location_longitude"),
  photoLocationCountry: text("photo_location_country"),
  photoLocationCity: text("photo_location_city"),
  statsViews: integer("stats_views"),
  statsDownloads: integer("stats_downloads"),
  aiDescription: text("ai_description"),
  aiPrimaryLandmarkName: text("ai_primary_landmark_name"),
  aiPrimaryLandmarkLatitude: real("ai_primary_landmark_latitude"),
  aiPrimaryLandmarkLongitude: real("ai_primary_landmark_longitude"),
  aiPrimaryLandmarkConfidence: text("ai_primary_landmark_confidence"),
  blurHash: text("blur_hash"),
});

export const unsplashKeywords = sqliteTable(
  "keywords",
  {
    photoId: text("photo_id").notNull(),
    keyword: text("keyword").notNull(),
    aiService1Confidence: real("ai_service_1_confidence"),
    aiService2Confidence: real("ai_service_2_confidence"),
    suggestedByUser: integer("suggested_by_user", { mode: "boolean" }),
    userSuggestionSource: text("user_suggestion_source"),
  },
  (table) => ({
    pk: { primaryKey: true, columns: [table.photoId, table.keyword] },
  }),
);

export const unsplashCollections = sqliteTable(
  "collections",
  {
    photoId: text("photo_id").notNull(),
    collectionId: text("collection_id").notNull(),
    collectionTitle: text("collection_title"),
    photoCollectedAt: text("photo_collected_at"),
    collectionType: text("collection_type"),
  },
  (table) => ({
    pk: { primaryKey: true, columns: [table.photoId, table.collectionId] },
  }),
);

export const unsplashConversions = sqliteTable("unsplash_conversions", {
  convertedAt: text("converted_at"),
  conversionType: text("conversion_type"),
  keyword: text("keyword"),
  photoId: text("photo_id"),
  anonymousUserId: text("anonymous_user_id"),
  conversionCountry: text("conversion_country"),
});

export const unsplashColors = sqliteTable(
  "colors",
  {
    photoId: text("photo_id").notNull(),
    hex: text("hex").notNull(),
    red: integer("red"),
    green: integer("green"),
    blue: integer("blue"),
    keyword: text("keyword"),
    aiCoverage: real("ai_coverage"),
    aiScore: real("ai_score"),
  },
  (table) => ({
    pk: { primaryKey: true, columns: [table.photoId, table.hex] },
  }),
);
