import { LivePreview, LiveProvider, LiveError } from "react-live";

type LivePlaygroundPreviewProps = {
  code: string;
  example?: string;
  dependencies?: Record<string, any>;
};

export const LivePlaygroundPreview = ({
  code,
  dependencies,
  example,
}: LivePlaygroundPreviewProps) => {
  return (
    <LiveProvider code={example ?? code} scope={{ ...dependencies }}>
      <div className="text-destructive text-center font-bold">
        <LiveError />
      </div>
      <LivePreview />
    </LiveProvider>
  );
};
