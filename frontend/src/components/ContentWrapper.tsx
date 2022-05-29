import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const animationConfiguration = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

function ContentWrapper({ children }: { children: string | ReactNode }) {
  return (
    <div className='md:px-10 mx-auto h-outlet px-2 text-gray-700'>
      <motion.div
        variants={animationConfiguration}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={{ duration: 0.4 }}
        className='h-full'
      >
        {children}
      </motion.div>
    </div>
  );
}

export default ContentWrapper;
