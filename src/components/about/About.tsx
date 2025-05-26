import React from 'react'
import FirstSection from './FirstSection'
import SecondSection from './SecondSection'

const About = () => {
  return (
    <div className='flex flex-col gap-10 mt-24'>
        <FirstSection/>
        <SecondSection/>
    </div>
  )
}

export default About