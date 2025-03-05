
import React from "react";
import { Check, X } from "lucide-react";
import { AspectRatioConfig } from "../../utils/aspectRatioConfig";

interface LayoutCellProps {
  index: number;
  gridItemStyle: React.CSSProperties;
  currentRatioConfig: AspectRatioConfig;
}

const LayoutCell: React.FC<LayoutCellProps> = ({ index, gridItemStyle, currentRatioConfig }) => {
  const isTopRow = (index: number) => index < 3;
  const isMiddleRow = (index: number) => index >= 3 && index < 6;
  const isBottomRow = (index: number) => index >= 6 && index < 9;
  const isNewBottomRow = (index: number) => index >= 9;

  return (
    <div 
      className="flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative" 
      style={gridItemStyle}
    >
      {isTopRow(index) && (
        <TopRowCell currentRatioConfig={currentRatioConfig} />
      )}

      {isMiddleRow(index) && (
        <MiddleRowCell />
      )}

      {isBottomRow(index) && (
        <BottomRowCell />
      )}

      {isNewBottomRow(index) && (
        <NewBottomRowCell />
      )}
    </div>
  );
};

// Components for each row type
const TopRowCell: React.FC<{ currentRatioConfig: AspectRatioConfig }> = ({ currentRatioConfig }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-blue-100 text-blue-800 text-xs font-medium p-1 rounded">
        {currentRatioConfig.ratio}
      </div>
      
      {currentRatioConfig.ratio === "21:11" ? (
        <WideAspectButtons currentRatioConfig={currentRatioConfig} />
      ) : (
        <StandardAspectButtons currentRatioConfig={currentRatioConfig} />
      )}
    </div>
  );
};

const MiddleRowCell: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-purple-100 text-purple-800 text-xs font-medium p-1 rounded">
        4:5
      </div>
      
      <div 
        className="flex w-full absolute"
        style={{ 
          height: '60px',
          top: '20px',
        }}
        ref={(el) => {
          if (el) {
            const height = el.parentElement?.clientHeight 
              ? el.parentElement.clientHeight - 20 - 60 
              : 0;
            const width = height * (4/5);
            
            el.style.width = `${width}px`;
            el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - width / 2}px`;
          }
        }}
      >
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <X size={24} color="#990000" />
        </div>
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <Check size={24} color="#0c343d" />
        </div>
      </div>
      
      <div 
        className="bg-gray-400 absolute"
        style={{ 
          top: 'auto',
          height: 'auto',
          width: 'auto',
          bottom: 0,
        }}
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttons = parentEl.querySelector('.flex.w-full.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const totalHeight = parentEl.clientHeight;
                const height = totalHeight - (buttonsTop + buttonsHeight);
                const width = height * (4/5);
                
                el.style.height = `${height}px`;
                el.style.width = `${width}px`;
                el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
                el.style.top = `${buttonsTop + buttonsHeight}px`;
              }
            }
          }
        }}
      />
    </div>
  );
};

const BottomRowCell: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-green-100 text-green-800 text-xs font-medium p-1 rounded">
        9:16
      </div>
      
      <div 
        className="flex w-full absolute"
        style={{ 
          height: '60px',
          top: '20px',
        }}
        ref={(el) => {
          if (el) {
            const height = el.parentElement?.clientHeight 
              ? el.parentElement.clientHeight - 20 - 60 
              : 0;
            const width = height * (9/16);
            
            el.style.width = `${width}px`;
            el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - width / 2}px`;
          }
        }}
      >
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <X size={24} color="#990000" />
        </div>
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <Check size={24} color="#0c343d" />
        </div>
      </div>
      
      <div 
        className="bg-gray-400 absolute"
        style={{ 
          top: 'auto',
          height: 'auto',
          width: 'auto',
          bottom: 0,
        }}
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttons = parentEl.querySelector('.flex.w-full.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const totalHeight = parentEl.clientHeight;
                const height = totalHeight - (buttonsTop + buttonsHeight);
                const width = height * (9/16);
                
                el.style.height = `${height}px`;
                el.style.width = `${width}px`;
                el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
                el.style.top = `${buttonsTop + buttonsHeight}px`;
              }
            }
          }
        }}
      />
    </div>
  );
};

const NewBottomRowCell: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-end relative" style={{ paddingTop: '20px' }}>
      <div className="absolute top-0 left-0 bg-yellow-100 text-yellow-800 text-xs font-medium p-1 rounded">
        21:11
      </div>
      
      <div 
        className="flex w-full absolute"
        style={{ 
          height: '60px',
          top: '20px',
        }}
        ref={(el) => {
          if (el) {
            const parentWidth = el.parentElement?.clientWidth ?? 0;
            // Use 95% of parent width to have 10px padding on each side
            const maxWidth = parentWidth * 0.95;
            
            el.style.width = `${maxWidth}px`;
            el.style.left = `${(parentWidth - maxWidth) / 2}px`;
          }
        }}
      >
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <X size={24} color="#990000" />
        </div>
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <Check size={24} color="#0c343d" />
        </div>
      </div>
      
      <div 
        className="bg-gray-400 absolute"
        style={{ 
          top: 'auto',
          height: 'auto',
          width: 'auto',
        }}
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttons = parentEl.querySelector('.flex.w-full.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const parentWidth = parentEl.clientWidth;
                
                // Use 95% of available width for 10px padding on each side
                const maxWidth = parentWidth * 0.95;
                const height = maxWidth * (11/21); // Apply aspect ratio
                
                el.style.width = `${maxWidth}px`;
                el.style.height = `${height}px`;
                el.style.left = `${(parentWidth - maxWidth) / 2}px`;
                // Remove gap by setting top position to button bottom
                el.style.top = `${buttonsTop + buttonsHeight}px`;
              }
            }
          }
        }}
      />
    </div>
  );
};

// Specific aspect ratio button layouts
const WideAspectButtons: React.FC<{ currentRatioConfig: AspectRatioConfig }> = ({ currentRatioConfig }) => {
  return (
    <>
      <div 
        className="flex absolute"
        style={{ 
          height: '60px',
          top: '20px'
        }}
        ref={(el) => {
          if (el) {
            const parentWidth = el.parentElement?.clientWidth ?? 0;
            // Use 95% of parent width for 10px padding on each side
            const maxWidth = parentWidth * 0.95;
            
            el.style.width = `${maxWidth}px`;
            el.style.left = `${(parentWidth - maxWidth) / 2}px`;
          }
        }}
      >
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <X size={24} color="#990000" />
        </div>
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <Check size={24} color="#0c343d" />
        </div>
      </div>
      
      <div 
        className="bg-gray-400 absolute"
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttons = parentEl.querySelector('.flex.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const parentWidth = parentEl.clientWidth;
                
                // Use 95% of available width for 10px padding on each side
                const maxWidth = parentWidth * 0.95;
                const height = maxWidth * (11/21); // Apply aspect ratio
                
                el.style.width = `${maxWidth}px`;
                el.style.height = `${height}px`;
                el.style.left = `${(parentWidth - maxWidth) / 2}px`;
                // Remove gap by setting top position to button bottom
                el.style.top = `${buttonsTop + buttonsHeight}px`;
              }
            }
          }
        }}
      />
    </>
  );
};

const StandardAspectButtons: React.FC<{ currentRatioConfig: AspectRatioConfig }> = ({ currentRatioConfig }) => {
  return (
    <>
      <div 
        className="flex w-full absolute"
        style={{ 
          height: '60px',
          top: '20px',
        }}
        ref={(el) => {
          if (el) {
            const height = el.parentElement?.clientHeight 
              ? el.parentElement.clientHeight - 20 - 60 
              : 0;
            const width = height * (currentRatioConfig.width / currentRatioConfig.height);
            
            el.style.width = `${width}px`;
            el.style.left = `${(el.parentElement?.clientWidth ?? 0) / 2 - width / 2}px`;
          }
        }}
      >
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <X size={24} color="#990000" />
        </div>
        <div className="bg-white h-full w-1/2 border border-gray-700 flex items-center justify-center">
          <Check size={24} color="#0c343d" />
        </div>
      </div>
      
      <div 
        className="bg-gray-400 absolute"
        style={{ 
          top: 'auto',
          height: 'auto',
          width: 'auto',
          bottom: 0,
        }}
        ref={(el) => {
          if (el) {
            const parentEl = el.parentElement;
            if (parentEl) {
              const buttons = parentEl.querySelector('.flex.w-full.absolute') as HTMLElement;
              if (buttons) {
                const buttonsHeight = buttons.offsetHeight;
                const buttonsTop = parseInt(buttons.style.top, 10);
                const totalHeight = parentEl.clientHeight;
                const height = totalHeight - (buttonsTop + buttonsHeight);
                const width = height * (currentRatioConfig.width / currentRatioConfig.height);
                
                el.style.height = `${height}px`;
                el.style.width = `${width}px`;
                el.style.left = `${(parentEl.offsetWidth - width) / 2}px`;
                el.style.top = `${buttonsTop + buttonsHeight}px`;
              }
            }
          }
        }}
      />
    </>
  );
};

export default LayoutCell;
