
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { getColumns } from "./columns";
import ImageGenerationTest from "./components/ImageGenerationTest";
import VideoCreator from "./components/VideoCreator";
import { useImagesData } from "./hooks/useImagesData";

const Images = () => {
  const { data, messageOptions } = useImagesData();

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="flex flex-col gap-6">
            <SharedTable 
              data={data} 
              columns={getColumns(messageOptions)} 
              tableName="e1images" 
              idField="image_id" 
            />
            
            <ImageGenerationTest />
            
            <VideoCreator />
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Images;
