import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, galleryPhotosTable } from "@workspace/db";
import {
  CreateGalleryPhotoBody,
  UpdateGalleryPhotoParams,
  UpdateGalleryPhotoBody,
  DeleteGalleryPhotoParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/gallery", async (_req, res): Promise<void> => {
  const photos = await db
    .select()
    .from(galleryPhotosTable)
    .orderBy(desc(galleryPhotosTable.createdAt));
  res.json(photos);
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryPhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [photo] = await db.insert(galleryPhotosTable).values(parsed.data).returning();
  res.status(201).json(photo);
});

router.put("/gallery/:id", async (req, res): Promise<void> => {
  const params = UpdateGalleryPhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateGalleryPhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [photo] = await db
    .update(galleryPhotosTable)
    .set(parsed.data)
    .where(eq(galleryPhotosTable.id, params.data.id))
    .returning();

  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }

  res.json(photo);
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const params = DeleteGalleryPhotoParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [photo] = await db
    .delete(galleryPhotosTable)
    .where(eq(galleryPhotosTable.id, params.data.id))
    .returning();

  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
