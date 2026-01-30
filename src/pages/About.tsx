import { PageLayout } from '@/components/layout/PageLayout';
import { BlockRenderer } from '@/components/blocks';
import { usePageBlocks } from '@/hooks/usePageBlocks';
import { Skeleton } from '@/components/ui/skeleton';

export default function About() {
  const { data: blocks, isLoading } = usePageBlocks('sobre');

  if (isLoading) {
    return (
      <PageLayout>
        <div className="pt-28 pb-20 container">
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="py-20 container">
          <Skeleton className="h-[200px] w-full" />
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
}
