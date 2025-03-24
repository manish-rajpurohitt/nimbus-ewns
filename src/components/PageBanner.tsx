import Image from "next/image";

interface PageBannerProps {
  bannerImage: string;
  title: string;
  currentPage: string;
}

export default function PageBanner({
  bannerImage,
  title,
  currentPage
}: PageBannerProps) {
  return (
    <div className="relative h-[500px] w-full">
      <Image
        src={bannerImage}
        key={bannerImage}
        alt={`${title} Banner`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60 flex flex-col justify-center px-8 md:px-16">
        <div className="text-sm md:text-base text-white/80 breadcrumbs">
          <span>Home</span>
          <span className="mx-2">&gt;</span>
          <span>{currentPage}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mt-4 text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}
