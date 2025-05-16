"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Plus } from "lucide-react";
import { Link } from "react-router";
import CollectionDialog from "@/components/Collections/CollectionDialog";
import { toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

// This would typically come from your API or database
const collections: any[] | (() => any[]) = [
  // Uncomment to add more collections for testing
  {
    id: "2",
    name: "Product Photos",
    thumbnail: "/placeholder.svg?height=200&width=300",
    assetCount: 12,
    owner: {
      initials: "JD",
      color: "#3366ff"
    }
  },
];

export default function CollectionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [collectionsData, setCollectionsData] = useState(collections);

  // If you want to test the empty state, set this to an empty array
  const hasCollections = collectionsData.length > 0;

  const handleCreateCollection = (data: { name: string }) => {
    // In a real app, this would be an API call
    const newCollection = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      thumbnail: "/placeholder.svg?height=200&width=300",
      assetCount: 0,
      owner: {
        initials: "ME", // This would come from the user's profile
        color: "#ff3366", // This could be randomly generated or from user settings
      },
    };

    setCollectionsData([...collectionsData, newCollection]);

    toast.success("Collection created");

    return Promise.resolve();
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-1 h-4 w-4 cursor-pointer" />
          Create Collection
        </Button>
      </div>

      {hasCollections ? (
        <motion.div 
           initial={{ y:20}}
                  animate={{ y:0}}
                  exit={{ y:0 }}
                  transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
          {collectionsData.map((collection) => (
            <div key={collection.id} className="block group ">
              <div className="rounded-lg overflow-hidden border border-border bg-card transition-all hover:shadow-md">
                <Link
                  to={`/dashboard/media/collections/${collection.id}`}
                 
                >
                    <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={collection.thumbnail || "/placeholder.svg"}
                    alt={collection.name}
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 text-xs rounded backdrop-blur-sm">
                    {collection.name}
                  </div>
                  </div>
                </Link>
                <div className="p-3 flex items-center justify-between dark:bg-accent ">
                  <div className="flex items-center gap-2 ">
                    <div
                      className="w-8 h-8  rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: collection.owner.color }}
                    >
                      {collection.owner.initials}
                    </div>
                    <span className="text-sm">
                      {collection.assetCount} Assets
                    </span>
                  </div>
                  <button className="p-1 rounded-full hover:bg-muted">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0.5, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="max-w-md mb-8">
              <img
                src="/empty_state_collection.svg"
                alt="Empty collections illustration"
                width={400}
                height={300}
                className="mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold mb-2">Collections</h2>
              <p className="text-muted-foreground mb-6">
                Use collections to dynamically group your assets and share them
                internally or externally
              </p>
              <Button
                className="mx-auto cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                Create New Collection
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      <CollectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateCollection={handleCreateCollection}
      />
    </div>
  );
}
