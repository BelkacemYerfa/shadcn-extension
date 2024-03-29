import { memo } from "react";
import { LivePreview, LiveProvider, LiveError, withLive } from "react-live";

type LivePlaygroundPreviewProps = {
  code?: string;
  example?: string;
  dependencies?: Record<string, any>;
};

export const LivePlaygroundPreview = memo(
  ({ code, dependencies, example }: LivePlaygroundPreviewProps) => {
    return (
      <LiveProvider code={code ?? example} scope={{ ...dependencies }}>
        <div className="text-destructive text-center font-bold">
          <LiveError />
        </div>
        <LivePreview />
      </LiveProvider>
    );
  }
);

LivePlaygroundPreview.displayName = "LivePlaygroundPreview";
