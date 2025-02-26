
import { supabase } from "@/integrations/supabase/client";

interface TableImageCellProps {
  imagePath: string;
}

export function TableImageCell({ imagePath }: TableImageCellProps) {
  const { data } = supabase.storage
    .from('adsmith_assets')
    .getPublicUrl(imagePath);
  
  return (
    <div className="w-[100px] h-[100px] flex items-center justify-center">
      <img 
        src={data.publicUrl} 
        alt="Generated image"
        className="max-w-full max-h-full object-contain rounded-md"
      />
    </div>
  );
}
