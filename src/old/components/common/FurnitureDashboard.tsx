import React from 'react'

const Card = ({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) => (
  <a
    href={href}
    className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition w-full h-48 md:h-56"
  >
    <div className="text-4xl mb-3">{icon}</div>
    <div className="text-lg font-semibold mb-1">{title}</div>
    <div className="text-sm text-gray-500 text-center">{description}</div>
  </a>
)

const FurnitureDashboard = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8">
    <Card icon={'🛒'} title="Cart" description="View and manage your cart items" href="/cart" />
    <Card icon={'📦'} title="Orders" description="Track your orders and history" href="/orders" />
    <Card icon={'❤️'} title="Wishlist" description="See your saved products" href="/wishlist" />
    <Card icon={'👤'} title="Account" description="Manage your profile and settings" href="/user" />
    <Card icon={'🚚'} title="Tracking" description="Track your shipments" href="/tracking" />
  </div>
)

export default FurnitureDashboard
