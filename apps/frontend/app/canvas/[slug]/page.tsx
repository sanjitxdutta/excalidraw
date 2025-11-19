
import { RoomCanvas } from "@/components/RoomCanvas";

export default function CanvasPage({ params }: {
  params: {
    slug: string
  }
}) {

  const { slug } = params;

  return <RoomCanvas slug={slug} />
}
