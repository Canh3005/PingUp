import React, { useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

const StoryCard = ({ story }) => {
  const user = story.user || {};
  const type = story.media_type;
  const isText = type === "text" || type === "text_with_bg";
  const isImage = type === "image";
  const isVideo = type === "video";

  return (
    <div className="relative w-40 h-55 rounded-xl overflow-hidden shrink-0 bg-white cursor-pointer">
      {/* media */}
      {isText && (
        <div
          className="w-full h-full flex items-center p-2 text-white text-xs"
          style={{ backgroundColor: story.background_color || "#4f46e5" }}
        >
          <span className="line-clamp-4 leading-tight opacity-95">{story.content}</span>
        </div>
      )}
      {isImage && (
        <img
          src={story.media_url}
          alt="story"
          className="w-full h-full object-cover"
          draggable={false}
        />
      )}
      {isVideo && (
        <video
          src={story.media_url}
          className="w-full h-full object-cover"
          muted
          autoPlay
          loop
        />
      )}

      {/* user avatar */}
      <div className="absolute top-2 left-2">
        <img
          src={user.profile_picture || user.imageUrl}
          alt={user.username || "user"}
          className="w-10 h-10 rounded-full border-2 border-white object-cover"
          draggable={false}
        />
      </div>
      <div className="absolute bottom-2 left-2 text-white text-xs">
        <span className="font-medium">{user.username || "User"}</span>
      </div>
    </div>
  );
};

const AddStoryCard = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="relative w-40 h-55 rounded-xl overflow-hidden shrink-0 bg-gray-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-white border-2 border-dashed border-gray-300"
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-gray-900 shadow cursor-pointer hover:bg-gray-800">
      <Plus className="w-5 h-5 text-white" />
    </div>
    <div className="mt-2 text-sm font-medium text-gray-900">Create story</div>
  </button>
);

const StoryItems = ({ stories = [], onAddStory }) => {
  // Show up to 5 cards: 1 add-card + 4 story cards
  const maxVisibleStories = 4;
  const [start, setStart] = useState(0);

  const maxStart = Math.max(0, (stories?.length || 0) - maxVisibleStories);
  const canPrev = start > 0;
  const canNext = start < maxStart;

  const visibleStories = useMemo(() => {
    return (stories || []).slice(start, start + maxVisibleStories);
  }, [stories, start]);

  const handlePrev = () => {
    if (canPrev) setStart((s) => Math.max(0, s - 1));
  };
  const handleNext = () => {
    if (canNext) setStart((s) => Math.min(maxStart, s + 1));
  };

  return (
    <div className="rounded-xl p-3">

      <div className="relative">
        {/* Slider viewport */}
        <div className="flex gap-3 items-center justify-center">
          {/* Add-story card at first position */}
          <AddStoryCard onClick={onAddStory} />

          {/* Up to 4 real stories */}
          {visibleStories.map((s) => (
            <StoryCard key={s._id} story={s} />
          ))}
        </div>

        {/* Left / Right circular arrow buttons */}
        {maxStart > 0 && (
          <>
            <button
              type="button"
              aria-label="Previous stories"
              onClick={handlePrev}
              disabled={!canPrev}
              className={`absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <ChevronLeft className="w-5 h-5 cursor-pointer" />
            </button>
            <button
              type="button"
              aria-label="Next stories"
              onClick={handleNext}
              disabled={!canNext}
              className={`absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <ChevronRight className="w-5 h-5 cursor-pointer" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StoryItems;
