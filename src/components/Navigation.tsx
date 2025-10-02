"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  BarChart3,
  AlertTriangle,
  Settings,
  FileText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Threat Register", href: "/threats", icon: AlertTriangle },
  { name: "Impact Assessment", href: "/impact", icon: Shield },
  { name: "Likelihood Assessment", href: "/likelihood", icon: Settings },
  { name: "Risk Calculation", href: "/risk", icon: BarChart3 },
  { name: "Countermeasures", href: "/countermeasures", icon: FileText },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Risk Analysis Tool
            </h1>
          </div>

          <div className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

