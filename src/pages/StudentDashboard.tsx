
import React from 'react';
import { Book, Play, Award, Clock, TrendingUp, Calendar, Star, Home, User, Settings, BookOpen, BarChart3, MessageSquare, Search, Mail, Bell, Heart, Users, LogOut, Inbox, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StudentDashboard = () => {
  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/etudiant", icon: Home, isActive: true },
    { title: "Inbox", href: "/dashboard/etudiant/inbox", icon: Inbox },
    { title: "Lesson", href: "/dashboard/etudiant/lessons", icon: BookOpen },
    { title: "Task", href: "/dashboard/etudiant/tasks", icon: CheckSquare },
    { title: "Group", href: "/dashboard/etudiant/groups", icon: Users },
  ];

  const friends = [
    { name: "Bagas Mahpie", status: "Friend", avatar: "BM" },
    { name: "Sir Dandy", status: "Old Friend", avatar: "SD" },
    { name: "Jhon Tosan", status: "Friend", avatar: "JT" },
  ];

  const mentors = [
    { name: "Padhang Satrio", role: "Mentor", avatar: "PS" },
    { name: "Zakir Horizontal", role: "Mentor", avatar: "ZH" },
    { name: "Leonardo Samsul", role: "Mentor", avatar: "LS" },
  ];

  const progressCourses = [
    { title: "UI/UX Design", watched: 2, total: 8, color: "bg-purple-100 text-purple-600" },
    { title: "Branding", watched: 3, total: 8, color: "bg-pink-100 text-pink-600" },
    { title: "FrontEnd", watched: 6, total: 12, color: "bg-blue-100 text-blue-600" },
  ];

  const continueWatching = [
    {
      id: 1,
      title: "Beginner's Guide to Becoming a Professional Front-End Developer",
      category: "FRONTEND",
      instructor: "Leonardo samsul",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
      categoryColor: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      title: "Optimizing User Experience with the Best UI/UX Design",
      category: "UI/UX DESIGN",
      instructor: "Bayu Salto",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=200&fit=crop",
      categoryColor: "bg-purple-100 text-purple-600"
    },
    {
      id: 3,
      title: "Reviving and Refresh Company Image",
      category: "BRANDING",
      instructor: "Padhang Satrio",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      categoryColor: "bg-pink-100 text-pink-600"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Coursue</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">OVERVIEW</span>
        </div>
        <nav className="px-6 space-y-1">
          {sidebarItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                item.isActive 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.title}
            </a>
          ))}
        </nav>

        {/* Friends Section */}
        <div className="px-6 mt-8">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">FRIENDS</span>
        </div>
        <div className="px-6 mt-4 space-y-3">
          {friends.map((friend) => (
            <div key={friend.name} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-gray-100">{friend.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                <p className="text-xs text-gray-500">{friend.status}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="mt-auto px-6 pb-6">
          <div className="border-t border-gray-200 pt-4">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">SETTINGS</span>
          </div>
          <div className="mt-4 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900">
              <Settings className="mr-3 h-5 w-5" />
              Setting
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your course..."
                  className="pl-10 bg-gray-50 border-0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-500" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>JR</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">Jason Ranti</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 text-white">
              <div className="max-w-md">
                <p className="text-sm font-medium mb-2 text-purple-200">ONLINE COURSE</p>
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  Sharpen Your Skills with Professional Online Courses
                </h1>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Join Now
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Courses */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {progressCourses.map((course, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${course.color}`}>
                      {course.title}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <span className="text-gray-400">⋯</span>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{course.watched}/{course.total} watched</p>
                </Card>
              ))}
            </div>

            {/* Continue Watching */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Continue Watching</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <span className="text-gray-400">←</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full bg-purple-100">
                    <span className="text-purple-600">→</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {continueWatching.map((course) => (
                  <Card key={course.id} className="overflow-hidden group cursor-pointer">
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <span className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-medium ${course.categoryColor}`}>
                        {course.category}
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                          <p className="text-xs text-gray-500">Mentor</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Your Lesson */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Lesson</CardTitle>
                  <Button variant="ghost" className="text-purple-600 text-sm">See all</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Avatar>
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">Padhang Satrio</span>
                      <span className="text-xs text-gray-500">2/16/2024</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs font-medium">UI/UX DESIGN</span>
                      <span className="text-sm text-gray-600">Understand Of UI/UX Design</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full border">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 bg-white border-l border-gray-200 p-6">
            {/* Statistics */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Statistic</CardTitle>
                  <Button variant="ghost" size="icon">
                    <span className="text-gray-400">⋯</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarFallback className="text-lg bg-purple-100 text-purple-600">99%</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg text-gray-900">Good Morning Jason 👋</h3>
                  <p className="text-sm text-gray-500">Continue your learning to achieve your target!</p>
                </div>
                <div className="h-32 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                  <div className="bg-purple-200 rounded w-8 h-8"></div>
                  <div className="bg-purple-400 rounded w-8 h-16"></div>
                  <div className="bg-purple-200 rounded w-8 h-12"></div>
                  <div className="bg-purple-600 rounded w-8 h-20"></div>
                  <div className="bg-purple-200 rounded w-8 h-10"></div>
                </div>
              </CardContent>
            </Card>

            {/* Your Mentor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your mentor</CardTitle>
                  <Button variant="ghost" size="icon">
                    <span className="text-xl">+</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentors.map((mentor) => (
                  <div key={mentor.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="text-xs">{mentor.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                        <p className="text-xs text-gray-500">{mentor.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Follow
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-purple-600 text-sm mt-4">
                  See All
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
