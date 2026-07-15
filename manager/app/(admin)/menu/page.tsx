import { ErrorPanel, PageHeader } from "@/components/ui";
import { MenuStudio } from "@/components/menu-studio";
import { getMenuStudio } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  try {
    const studio = await getMenuStudio();
    return <>
      <PageHeader
        eyebrow="Visual bot studio"
        title="Your complete bot, live and editable"
        description="Click through real bot responses and keyboards, edit the content beside the preview, test privately, then publish the complete flow in one safe update."
      />
      <MenuStudio initial={studio} />
    </>;
  } catch (error) {
    return <>
      <PageHeader eyebrow="Visual bot studio" title="Bot menu" description="Live menu editing and publishing." />
      <ErrorPanel message={error instanceof Error ? error.message : "Unknown error."} />
    </>;
  }
}
