import { PageLayout } from "@/components/layout/PageLayout";
import { BlockRenderer } from "@/components/blocks";
import { usePageBlocks } from "@/hooks/usePageBlocks";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: blocks, isLoading } = usePageBlocks('home');

  if (isLoading) {
    return (
      <PageLayout>
        <div className="pt-32 pb-28 container">
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="py-28 container">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {blocks?.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </PageLayout>
  );
};

export default Index;
