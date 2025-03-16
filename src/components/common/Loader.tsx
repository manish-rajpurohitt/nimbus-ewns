export default function Loader() {
  return (
    <div className="flex justify-center items-center my-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-[#f3f3f3] border-t-[rgb(1,82,168)] animate-spin"></div>
        <div className="w-8 h-8 rounded-full border-4 border-[#f3f3f3] border-t-[rgb(1,82,168)] animate-spin absolute top-2 left-2"></div>
      </div>
    </div>
  );
}
