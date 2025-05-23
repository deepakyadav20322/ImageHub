import { and, eq } from "drizzle-orm";
import { db } from "../db/db_connect";
import { collectionItems, collections } from "../db/schema";
import { Request, Response } from "express";

export const getAllCollections = async (req: Request, res: Response): Promise<any> => {
  try {
    // Assuming accountId is passed as a query parameter or in the JWT
    const accountId = (req.user.accountId);
    const userId = req.user.userId;

    if (!accountId || !userId) {
      return res.status(400).json({ error: 'Account or USER  ID is required' });
    }

    const allCollections = await db
      .select()
      .from(collections)
      .where(and(eq(collections.accountId, accountId), eq(collections.creatorId, userId)));

    res.status(200).json({ success: true, data: allCollections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const createCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;
    const creatorId = req.user.userId;
    const accountId = req.user.accountId
    console.log(accountId, creatorId)
    if (!accountId || !name) {
      return res.status(400).json({
        error: 'Account ID and name are required'
      });
    }

    const [newCollection] = await db
      .insert(collections)
      .values({
        accountId,
        creatorId,
        name,
        description: '',
        // createdAt and updatedAt will be set by default
      })
      .returning();

    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const collectionId = req.params.collectionId;

    await db
      .delete(collections)
      .where(eq(collections.id, collectionId));

    res.status(200).json({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const collectionId = req.params.collectionId;
    const { name, description } = req.body;
    console.log(req.body)

    if (!collectionId) {
      return res.status(400).json({ error: 'Collection ID is required' });
    }

    const updateData: Partial<typeof collections.$inferSelect> = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const [updatedCollection] = await db
      .update(collections)
      .set(updateData)
      .where(eq(collections.id, collectionId))
      .returning();

    if (!updatedCollection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.status(200).json({ success: true, data: updatedCollection });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const addItemToCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { collectionId, resourceId } = req.body;

    if (!collectionId || !resourceId) {
      return res.status(400).json({ error: 'Collection ID and resource ID are required' });
    }

    const [newCollectionItem] = await db
      .insert(collectionItems)
      .values({
        collectionId,
        resourceId,
      })
      .returning();

    res.status(201).json({ success: true, data: newCollectionItem });
  } catch (error) {
    console.error('Error adding item to collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getItemsOfCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const collectionId = req.params.collectionId;

    if (!collectionId) {
      return res.status(400).json({ error: 'Collection ID is required' });
    }

    const items = await db
      .select()
      .from(collectionItems)
      .where(eq(collectionItems.collectionId, collectionId));

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching collection items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteItemFromCollection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { collectionId, resourceId } = req.params;

    if (!collectionId || !resourceId) {
      return res.status(400).json({ error: 'Collection ID and resource ID are required' });
    }

    await db
      .delete(collectionItems)
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(collectionItems.resourceId, resourceId)
        )
      );

    res.status(200).json({ success: true, message: 'Item removed from collection successfully' });
  } catch (error) {
    console.error('Error removing item from collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};