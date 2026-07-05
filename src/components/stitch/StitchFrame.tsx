type StitchFrameProps = {
  src: string;
  title: string;
};

export function StitchFrame({ src, title }: StitchFrameProps) {
  return (
    <iframe
      src={src}
      style={{
        border: 0,
        display: "block",
        minHeight: "100vh",
        width: "100%",
      }}
      title={title}
    />
  );
}
