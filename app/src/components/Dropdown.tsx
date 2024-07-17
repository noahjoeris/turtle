import { AnimatePresence, motion } from 'framer-motion'
import { FC, ReactNode, RefObject } from 'react'

interface DropdownProps {
  isOpen: boolean
  dropdownRef: RefObject<HTMLDivElement>
  children: ReactNode
}

const Dropdown: FC<DropdownProps> = ({ isOpen, dropdownRef, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ height: '3.6rem' }}
          animate={{
            height: 'auto',
            transition: { type: 'spring', stiffness: 700, damping: 23 },
          }}
          exit={{
            height: '3.6rem',
            transition: { duration: 0.06 },
          }}
          className="absolute left-0 right-0 top-0 z-20 overflow-hidden rounded-md border-1 border-turtle-level3 bg-white"
        >
          <ul className="flex flex-col gap-2 px-1 py-2">{children}</ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Dropdown
