import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Calendar, User, Clock, Tag, ChevronLeft, Share2 } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif italic">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      <Helmet>
        <title>{post.title} | NomadBudget Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://nomadbudget.netlify.app/blog/${post.slug}`} />
        
        {/* OpenGraph / Twitter */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://nomadbudget.netlify.app/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 pb-16 w-full space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 text-white/80 text-xs font-bold uppercase tracking-widest"
            >
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" /> {post.category}
              </span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif italic text-white leading-tight"
            >
              {post.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between pt-8 border-t border-white/20"
            >
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">{post.author}</p>
                  <p className="text-xs text-white/60">{post.date}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article Content */}
          <article className="flex-grow space-y-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Journal</span>
            </Link>
            
            <div 
              className="prose prose-lg prose-gray max-w-none 
                prose-headings:font-serif prose-headings:italic prose-headings:text-[#1A1A1A]
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-strong:text-[#1A1A1A] prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-12">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xl font-serif italic">About the Author</h3>
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {post.author} is a seasoned traveler and digital nomad with over 10 years of experience exploring the world on a budget.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-serif italic">Related Posts</h3>
              <div className="space-y-6">
                {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(related => (
                  <Link key={related.id} to={`/blog/${related.slug}`} className="group block space-y-2">
                    <div className="aspect-video rounded-2xl overflow-hidden border border-gray-100">
                      <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h4 className="font-serif italic text-sm group-hover:underline">{related.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
