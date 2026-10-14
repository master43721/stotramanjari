import { StotramGridSkeleton } from "@/components/SkeletonLoader";

export default function Loading() {
  return (
    <div className="container" style={{ paddingBlock: "4rem" }}>
      <StotramGridSkeleton count={9} />
    </div>
  );
}

