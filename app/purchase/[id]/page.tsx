'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Course {
  id: string
  title: string
  description: string
}

export default function PurchasePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      // Fetch course details
      fetch(`/api/courses/${params.id}`)
        .then(res => res.json())
        .then(data => setCourse(data))
    }
  }, [status, router, params.id])

  const handlePurchase = async () => {
    const res = await fetch(`/api/purchase/${params.id}`, {
      method: 'POST',
    })
    if (res.ok) {
      router.push(`/course/${params.id}`)
    } else {
      // Handle error
      console.error('Purchase failed')
    }
  }

  if (status === 'loading' || !course) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Purchase Course</h1>
              <p className="mt-2 text-gray-600">{course.title}</p>
              <p className="mt-2 text-gray-600">{course.description}</p>
            </div>
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePurchase}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Purchase Course
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

