import type React from "react"
import { LogOut, MoveUpRight, Settings, CreditCard, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface MenuItem {
  label: string
  value?: string
  href: string
  icon?: React.ReactNode
  external?: boolean
}

interface Profile01Props {
  name: string
  role: string
  avatar: string
  subscription?: string
}

const defaultProfile = {
  name: "John Doe",
  role: "Prompt Engineer",
  avatar: "/avatar.png",
  subscription: "Free Trial",
} satisfies Required<Profile01Props>

export default function Profile01({
  name = defaultProfile.name,
  role = defaultProfile.role,
  avatar = defaultProfile.avatar,
  subscription = defaultProfile.subscription,
}: Partial<Profile01Props> = defaultProfile) {
  const menuItems: MenuItem[] = [
    {
      label: "Subscription",
      value: subscription,
      href: "#",
      icon: <CreditCard className="w-4 h-4" />,
      external: false,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      label: "Terms & Policies",
      href: "#",
      icon: <FileText className="w-4 h-4" />,
      external: true,
    },
  ]

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-2 group">
          <div className="flex items-center gap-4 mb-8 sm:justify-start justify-center">
            <div className="relative shrink-0">
              <Image
                src={avatar || "/avatar.png"}
                alt={name}
                width={72}
                height={72}
                className="rounded-full ring-4 ring-white dark:ring-zinc-900 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 hidden sm:block">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{name}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{role}</p>
            </div>
          </div>

          {/* Menu section - hidden by default, visible on hover */}
          <div className="overflow-hidden transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-96 group-hover:opacity-100 group-hover:pb-4">
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between p-2 
                                      hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                      rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                  </div>
                  <div className="flex items-center">
                    {item.value && <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">{item.value}</span>}
                    {item.external && <MoveUpRight className="w-4 h-4" />}
                  </div>
                </Link>
              ))}

              <button
                type="button"
                className="w-full flex items-center justify-between p-2 
                                  hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                  rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
