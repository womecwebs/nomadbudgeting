import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Helmet>
        <title>NomadBudget Blog: Expert Travel Tips & Cost Guides 2026</title>
        <meta name="description" content="Read our latest articles on budget travel, digital nomad life, and how to save money on your next adventure." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-5xl font-serif italic tracking-tight text-[#1A1A1A]">The Nomad Journal</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Expert insights, budget hacks, and destination guides for the modern traveler.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogPosts.map((post, idx) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`} className="space-y-6 block">
                <div className="aspect-[16/9] overflow-hidden rounded-[2rem] border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {post.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  
                  <h2 className="text-3xl font-serif italic leading-tight group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
