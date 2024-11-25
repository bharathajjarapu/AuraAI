'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Settings, ChevronLeft, Loader, PlusCircle, X, Pin, Trash2, Moon, Sun, Edit, Eye } from 'lucide-react'
import { Button } from "../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import ReactMarkdown from 'react-markdown'

// Mock data for diary entries
const mockEntries = [
  { id: 1, date: '2023-06-01', content: 'Today was a **great** day!', pinned: true },
  { id: 2, date: '2023-06-02', content: 'I learned something *new* today.', pinned: false },
  { id: 3, date: '2023-06-03', content: 'Had a challenging day, but I overcame it.', pinned: false },
  { id: 4, date: '2023-06-04', content: 'Spent time with family and friends.', pinned: true },
  { id: 5, date: '2023-06-05', content: 'Working on my personal project.', pinned: false },
  { id: 6, date: '2023-06-06', content: 'Reflected on my goals for the year.', pinned: false },
  { id: 7, date: '2023-06-07', content: 'Excited about the upcoming weekend!', pinned: false },
]

export default function AIDiaryApp() {
  const [entries, setEntries] = useState(mockEntries)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isEditMode, setIsEditMode] = useState(true)

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulating AI search with a delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSearchResult(`AI-generated result for "${searchQuery}"`)
    setIsSearching(false)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResult('')
  }

  const handleNewDay = () => {
    const newEntry = {
      id: entries.length + 1,
      date: new Date().toISOString().split('T')[0],
      content: '',
      pinned: false
    }
    setEntries([newEntry, ...entries])
    setSelectedEntry(newEntry)
    setIsEditMode(true)
  }

  const handleTogglePin = (entryId) => {
    const updatedEntries = entries.map(entry =>
      entry.id === entryId ? { ...entry, pinned: !entry.pinned } : entry
    )
    setEntries(updatedEntries)
    if (selectedEntry && selectedEntry.id === entryId) {
      setSelectedEntry({ ...selectedEntry, pinned: !selectedEntry.pinned })
    }
  }

  const handleDeleteEntry = (entryId) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId)
    setEntries(updatedEntries)
    setSelectedEntry(null)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-[#171717] text-black dark:text-white transition-colors duration-200">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">D</span>
          </h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleNewDay}>
              <PlusCircle className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuItem>Privacy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="px-4">
          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search your diary..."
                className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button className="ml-2" onClick={handleSearch}>
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {isSearching && (
            <div className="mt-4 flex justify-center">
              <Loader className="animate-spin" size={24} />
            </div>
          )}

          <AnimatePresence>
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <p>{searchResult}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Diary Entries Grid */}
          <AnimatePresence>
            {!selectedEntry && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layoutId={`entry-${entry.id}`}
                    onClick={() => setSelectedEntry(entry)}
                    className="p-4 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h2 className="font-bold mb-2">{entry.date}</h2>
                    <p className="text-sm">{entry.content.substring(0, 50)}...</p>
                    {entry.pinned && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        Pinned
                      </span>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Writing UI */}
          <AnimatePresence>
            {selectedEntry && (
              <motion.div
                layoutId={`entry-${selectedEntry.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-white dark:bg-[#171717] p-4 flex flex-col transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedEntry(null)}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold ml-2">{selectedEntry.date}</h2>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedEntry.pinned ? "default" : "outline"}
                      size="icon"
                      onClick={() => handleTogglePin(selectedEntry.id)}
                    >
                      <Pin className="h-5 w-5" />
                    </Button>
                    <Button
                      variant={isEditMode ? "default" : "outline"}
                      size="icon"
                      onClick={() => setIsEditMode(!isEditMode)}
                    >
                      {isEditMode ? <Eye className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteEntry(selectedEntry.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {isEditMode ? (
                  <textarea
                    className="flex-grow bg-gray-100 dark:bg-gray-800 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-200"
                    value={selectedEntry.content}
                    placeholder="Write your thoughts here..."
                    onChange={(e) => {
                      const updatedEntries = entries.map(entry =>
                        entry.id === selectedEntry.id ? { ...entry, content: e.target.value } : entry
                      )
                      setEntries(updatedEntries)
                      setSelectedEntry({ ...selectedEntry, content: e.target.value })
                    }}
                  />
                ) : (
                  <div className="flex-grow bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
                    <ReactMarkdown>{selectedEntry.content}</ReactMarkdown>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}