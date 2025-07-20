'use client';
import { forwardRef } from 'react';

const DEFAULT_CLASSNAME = "fixed top-0 left-0 h-[1080px] w-[1920px] pointer-events-none overflow-hidden";

const Screen = forwardRef(function Screen({ children, className, ...props }, ref) {
  return (
    <div ref={ref} className={className ?? DEFAULT_CLASSNAME} {...props}>
      {children}
    </div>
  );
});

export default Screen;
