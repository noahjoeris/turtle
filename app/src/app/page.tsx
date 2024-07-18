import { FC } from 'react'

import { HomeComponentSelect } from '@/components/HomeComponentSelect'
import { TurtlesBackground } from '@/components/TurtlesBackground'

const App: FC = async () => {
  return (
    <main>
      <TurtlesBackground/>
      <section className="z-10 flex flex-col items-center justify-center gap-8 p-1 sm:p-5">
        <HomeComponentSelect />
      </section>
    </main>
  )
}

export default App
