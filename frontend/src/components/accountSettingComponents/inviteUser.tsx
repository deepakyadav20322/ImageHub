"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, UserPlus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const InviteUser = () =>{
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const roles = [
    {
      id: "viewer",
      name: "Viewer",
      description: "Can view and comment",
    },
    {
      id: "editor",
      name: "Editor",
      description: "Can edit, view and comment",
    },
    {
      id: "admin",
      name: "Admin",
      description: "Full access to all resources",
    },
    {
      id: "manager",
      name: "Manager",
      description: "Can manage users and content",
    },
    {
      id: "developer",
      name: "Developer",
      description: "Technical access to code and APIs",
    },
    {
      id: "analyst",
      name: "Analyst",
      description: "Can view and analyze data",
    },
    {
      id: "support",
      name: "Support Agent",
      description: "Can handle support tickets and customer inquiries",
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Access to marketing tools and campaigns",
    },
    {
      id: "finance",
      name: "Finance",
      description: "Access to financial data and reports",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false)
      setIsOpen(false)
      setEmail("")
    }, 1500)
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        <UserPlus className="w-4 h-4" />
        Invite User
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => !isSubmitting && !isSuccess && setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                layoutId="modal-container"
              >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                  <motion.h2 className="text-xl font-semibold text-gray-900 dark:text-white" layoutId="modal-title">
                    Invite Team Member
                  </motion.h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => !isSubmitting && !isSuccess && setIsOpen(false)}
                    disabled={isSubmitting || isSuccess}
                    className="rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center justify-center py-6"
                      >
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Invitation Sent!</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          An invitation has been sent to {email}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="colleague@company.com"
                            required
                            className="w-full rounded-lg border-gray-200 dark:border-gray-700"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Role</Label>
                          <div
                            className="max-h-[240px] overflow-y-auto pr-1 -mr-1"
                            style={{
                              scrollbarWidth: "thin",
                              scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
                            }}
                          >
                            <RadioGroup value={role} onValueChange={setRole} className="grid gap-3">
                              {roles.map((roleOption) => (
                                <div
                                  key={roleOption.id}
                                  className="flex items-center space-x-2 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                  <RadioGroupItem value={roleOption.id} id={roleOption.id} />
                                  <Label htmlFor={roleOption.id} className="flex flex-col cursor-pointer">
                                    <span className="font-medium">{roleOption.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {roleOption.description}
                                    </span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <motion.div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800" layout>
                  {!isSuccess && (
                    <>
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !email}
                        className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white ${
                          isSubmitting ? "opacity-80" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full"
                            />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          "Send Invitation"
                        )}
                      </Button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InviteUser