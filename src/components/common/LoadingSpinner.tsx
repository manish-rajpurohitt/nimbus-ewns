export default function LoadingSpinner() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-full h-full border-4 border-[rgb(1,82,168)] border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-[rgb(1,82,168)] rounded-full" />
        </div>
      </div>
    </div>
  );
}
