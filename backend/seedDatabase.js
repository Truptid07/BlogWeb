const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');
require('dotenv').config();

const sampleUsers = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Tech enthusiast and full-stack developer. Love sharing knowledge about modern web technologies.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    username: 'sarahtech',
    email: 'sarah@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    bio: 'Travel blogger and photographer. Exploring the world one destination at a time.',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
  },
  {
    username: 'mikecoder',
    email: 'mike@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Chen',
    bio: 'Frontend developer passionate about React and modern web design.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    bio: 'BlogWeb administrator and content curator.',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
  }
];

const sampleBlogs = [
  {
    title: 'The Future of Web Development: React 18 and Beyond',
    content: `
      <h2>Introduction</h2>
      <p>React 18 has revolutionized the way we build modern web applications. With features like concurrent rendering, automatic batching, and Suspense for data fetching, React continues to push the boundaries of what's possible in frontend development.</p>
      
      <h3>Key Features of React 18</h3>
      <ul>
        <li><strong>Concurrent Rendering:</strong> Allows React to interrupt rendering to handle high-priority tasks</li>
        <li><strong>Automatic Batching:</strong> Groups multiple state updates for better performance</li>
        <li><strong>Suspense for Data Fetching:</strong> Better loading states and error handling</li>
        <li><strong>Server Components:</strong> Render components on the server for improved performance</li>
      </ul>
      
      <h3>Performance Benefits</h3>
      <p>The new concurrent features in React 18 provide significant performance improvements, especially for complex applications with heavy user interactions.</p>
      
      <blockquote>
        "React 18 is not just an upgrade; it's a fundamental shift towards more responsive and efficient web applications."
      </blockquote>
      
      <h3>Getting Started</h3>
      <pre><code>npm install react@18 react-dom@18</code></pre>
      
      <p>Start leveraging these powerful features in your next project and experience the difference!</p>
    `,
    category: 'Technology',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    isPublished: true
  },
  {
    title: 'Hidden Gems of Southeast Asia: A Photographer\'s Journey',
    content: `
      <h2>Discovering Untouched Beauty</h2>
      <p>Southeast Asia is home to some of the world's most breathtaking landscapes and vibrant cultures. Join me on a photographic journey through lesser-known destinations that will leave you speechless.</p>
      
      <h3>1. Siquijor Island, Philippines</h3>
      <p>Known for its mystical charm and pristine beaches, Siquijor offers a perfect blend of adventure and tranquility. The island's crystal-clear waters and friendly locals make it a photographer's paradise.</p>
      
      <h3>2. Kampong Phluk, Cambodia</h3>
      <p>This floating village on Tonlé Sap Lake provides a unique glimpse into traditional Cambodian life. The stilted houses and mangrove forests create stunning compositions at sunset.</p>
      
      <h3>3. Nusa Penida, Indonesia</h3>
      <p>With its dramatic cliffs and turquoise waters, Nusa Penida has become increasingly popular among travelers seeking Instagram-worthy shots and unforgettable experiences.</p>
      
      <blockquote>
        "Travel is the only thing you buy that makes you richer in experiences and memories."
      </blockquote>
      
      <h3>Photography Tips for Southeast Asia</h3>
      <ul>
        <li>Golden hour shots are magical in tropical climates</li>
        <li>Respect local customs when photographing people</li>
        <li>Pack waterproof gear for monsoon season</li>
        <li>Wake up early for crowd-free shots at popular spots</li>
      </ul>
    `,
    category: 'Travel',
    tags: ['Travel', 'Photography', 'Southeast Asia', 'Adventure'],
    featuredImage: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    isPublished: true
  },
  {
    title: 'Building Scalable APIs with Node.js and Express',
    content: `
      <h2>Architecting Modern Backend Systems</h2>
      <p>Creating robust and scalable APIs is crucial for modern web applications. In this guide, we'll explore best practices for building APIs with Node.js and Express that can handle millions of requests.</p>
      
      <h3>Project Structure</h3>
      <pre><code>
project/
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
└── tests/
      </code></pre>
      
      <h3>Essential Middleware</h3>
      <ul>
        <li><strong>Helmet:</strong> Security headers</li>
        <li><strong>CORS:</strong> Cross-origin resource sharing</li>
        <li><strong>Rate Limiting:</strong> Prevent abuse</li>
        <li><strong>Authentication:</strong> JWT-based auth</li>
      </ul>
      
      <h3>Database Optimization</h3>
      <p>Choose the right database for your needs. MongoDB for flexibility, PostgreSQL for complex relations, Redis for caching.</p>
      
      <h3>Deployment Strategies</h3>
      <p>Container orchestration with Docker and Kubernetes ensures consistent deployments across environments.</p>
      
      <blockquote>
        "Good architecture is not about perfect design, but about making the right trade-offs."
      </blockquote>
    `,
    category: 'Technology',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    isPublished: true
  },
  {
    title: 'Mindful Living in a Digital World',
    content: `
      <h2>Finding Balance in the Age of Technology</h2>
      <p>In our hyperconnected world, practicing mindfulness has become more important than ever. Learn how to maintain mental well-being while navigating digital demands.</p>
      
      <h3>The Digital Dilemma</h3>
      <p>Constant notifications, social media pressure, and information overload can lead to stress, anxiety, and decreased productivity. It's time to reclaim control over our digital lives.</p>
      
      <h3>Mindful Technology Practices</h3>
      <ul>
        <li>Set designated phone-free times</li>
        <li>Use apps that promote well-being</li>
        <li>Practice single-tasking instead of multitasking</li>
        <li>Create physical boundaries between work and personal life</li>
      </ul>
      
      <h3>Daily Mindfulness Exercises</h3>
      <ol>
        <li><strong>Morning Meditation:</strong> Start with 10 minutes of breathing exercises</li>
        <li><strong>Mindful Walking:</strong> Take short walks without devices</li>
        <li><strong>Evening Reflection:</strong> Journal about your day's experiences</li>
      </ol>
      
      <blockquote>
        "The present moment is the only time over which we have dominion." - Thích Nhất Hạnh
      </blockquote>
      
      <p>Remember, technology should enhance our lives, not control them. Start small and gradually build healthy digital habits.</p>
    `,
    category: 'Lifestyle',
    tags: ['Mindfulness', 'Wellness', 'Digital Detox', 'Mental Health'],
    featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    isPublished: true
  },
  {
    title: 'The Art of Sourdough: From Starter to Perfect Loaf',
    content: `
      <h2>Mastering the Ancient Craft of Bread Making</h2>
      <p>Sourdough baking is both an art and a science. With patience and practice, you can create delicious, crusty loaves that rival any bakery.</p>
      
      <h3>Creating Your Starter</h3>
      <p>A healthy starter is the foundation of great sourdough. Mix equal parts flour and water, and feed it daily for 7-10 days until it's bubbly and doubles in size.</p>
      
      <h3>The Perfect Recipe</h3>
      <h4>Ingredients:</h4>
      <ul>
        <li>500g bread flour</li>
        <li>375ml water</li>
        <li>100g active starter</li>
        <li>10g salt</li>
      </ul>
      
      <h4>Method:</h4>
      <ol>
        <li>Autolyse: Mix flour and water, rest 30 minutes</li>
        <li>Add starter and salt, knead gently</li>
        <li>Bulk fermentation: 4-6 hours with folds every 30 minutes</li>
        <li>Pre-shape and final shape</li>
        <li>Cold retard overnight</li>
        <li>Score and bake at 450°F with steam</li>
      </ol>
      
      <h3>Tips for Success</h3>
      <blockquote>
        "Bread is not just food; it's a connection to tradition and a meditation on patience."
      </blockquote>
      
      <p>Temperature matters! Warmer environments speed up fermentation, while cooler temperatures slow it down. Learn to read your dough, not just follow timings.</p>
    `,
    category: 'Food',
    tags: ['Baking', 'Sourdough', 'Bread', 'Cooking'],
    featuredImage: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800',
    isPublished: true
  },
  {
    title: 'Machine Learning Demystified: A Beginner\'s Guide',
    content: `
      <h2>Understanding AI and Machine Learning</h2>
      <p>Machine Learning might seem complex, but understanding the basics can open up exciting possibilities in your career and daily life.</p>
      
      <h3>What is Machine Learning?</h3>
      <p>ML is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed for every task.</p>
      
      <h3>Types of Machine Learning</h3>
      <ul>
        <li><strong>Supervised Learning:</strong> Learning with labeled examples</li>
        <li><strong>Unsupervised Learning:</strong> Finding patterns in unlabeled data</li>
        <li><strong>Reinforcement Learning:</strong> Learning through rewards and penalties</li>
      </ul>
      
      <h3>Popular Algorithms</h3>
      <ol>
        <li>Linear Regression - Predicting continuous values</li>
        <li>Decision Trees - Classification and regression</li>
        <li>Neural Networks - Complex pattern recognition</li>
        <li>K-Means Clustering - Grouping similar data</li>
      </ol>
      
      <h3>Getting Started</h3>
      <pre><code>
# Python libraries to explore
import pandas as pd
import scikit-learn as sklearn
import tensorflow as tf
      </code></pre>
      
      <blockquote>
        "The future belongs to those who understand how to work with machines, not against them."
      </blockquote>
      
      <p>Start with simple projects like predicting house prices or classifying images. The key is consistent practice and curiosity!</p>
    `,
    category: 'Technology',
    tags: ['Machine Learning', 'AI', 'Python', 'Data Science'],
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    isPublished: true
  },
  {
    title: 'Remote Work Revolution: Building Your Dream Home Office',
    content: `
      <h2>Creating a Productive Remote Workspace</h2>
      <p>The remote work revolution has fundamentally changed how we approach our careers. Creating an inspiring home office is more important than ever for maintaining productivity and work-life balance.</p>
      
      <h3>Essential Elements of a Great Home Office</h3>
      <h4>1. Ergonomic Furniture</h4>
      <p>Invest in a quality chair and adjustable desk. Your spine will thank you after those long video calls!</p>
      
      <h4>2. Proper Lighting</h4>
      <p>Natural light boosts mood and productivity. Position your desk near a window, and add warm LED lights for darker days.</p>
      
      <h4>3. Tech Setup</h4>
      <ul>
        <li>High-speed internet connection</li>
        <li>Quality webcam and microphone</li>
        <li>Dual monitor setup for increased productivity</li>
        <li>Noise-canceling headphones</li>
      </ul>
      
      <h3>Design Tips for Inspiration</h3>
      <p>Personalize your space with plants, artwork, and items that spark joy. A well-designed workspace isn't just functional—it's inspiring.</p>
      
      <blockquote>
        "Your environment shapes your mindset. Create a space that motivates you to do your best work."
      </blockquote>
      
      <h3>Maintaining Work-Life Balance</h3>
      <p>Set clear boundaries between work and personal time. When the workday ends, physically step away from your office space.</p>
    `,
    category: 'Lifestyle',
    tags: ['Remote Work', 'Home Office', 'Productivity', 'Work-Life Balance'],
    featuredImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    isPublished: true
  },
  {
    title: 'Sustainable Fashion: Building a Conscious Wardrobe',
    content: `
      <h2>Fashion with a Purpose</h2>
      <p>The fashion industry is undergoing a significant transformation towards sustainability. Learn how to build a wardrobe that looks great and supports ethical practices.</p>
      
      <h3>What is Sustainable Fashion?</h3>
      <p>Sustainable fashion encompasses clothing that is designed, manufactured, and consumed in ways that minimize environmental impact and promote social responsibility.</p>
      
      <h3>Key Principles</h3>
      <ul>
        <li><strong>Quality over Quantity:</strong> Choose well-made pieces that last</li>
        <li><strong>Timeless Style:</strong> Opt for classic designs over fast fashion trends</li>
        <li><strong>Ethical Production:</strong> Support brands with fair labor practices</li>
        <li><strong>Circular Fashion:</strong> Embrace recycling, upcycling, and sharing</li>
      </ul>
      
      <h3>Building Your Sustainable Wardrobe</h3>
      <h4>Step 1: Audit Your Current Closet</h4>
      <p>Take inventory of what you own. Donate or recycle items you no longer wear.</p>
      
      <h4>Step 2: Define Your Style</h4>
      <p>Identify your personal aesthetic and color palette to make cohesive choices.</p>
      
      <h4>Step 3: Research Sustainable Brands</h4>
      <p>Look for certifications like GOTS, Fair Trade, or B-Corp when shopping.</p>
      
      <blockquote>
        "Fashion is about expressing who you are without compromising the world we live in."
      </blockquote>
      
      <h3>Care Tips for Longevity</h3>
      <p>Proper care extends the life of your clothing. Air dry when possible, use cold water, and store items properly.</p>
    `,
    category: 'Lifestyle',
    tags: ['Sustainable Fashion', 'Ethical Clothing', 'Environment', 'Style'],
    featuredImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    isPublished: true
  },
  {
    title: 'Urban Gardening: Growing Green in Small Spaces',
    content: `
      <h2>Bringing Nature to City Life</h2>
      <p>Living in an urban environment doesn't mean you can't enjoy the benefits of gardening. Discover how to create a thriving green oasis in even the smallest spaces.</p>
      
      <h3>Benefits of Urban Gardening</h3>
      <ul>
        <li>Fresh, organic produce at your fingertips</li>
        <li>Improved air quality and mental health</li>
        <li>Connection with nature and seasonal cycles</li>
        <li>Reduced grocery bills and carbon footprint</li>
      </ul>
      
      <h3>Small Space, Big Possibilities</h3>
      <h4>Vertical Gardens</h4>
      <p>Use walls and vertical structures to maximize growing space. Perfect for herbs, leafy greens, and strawberries.</p>
      
      <h4>Container Gardening</h4>
      <p>Almost anything can grow in containers with proper drainage and the right soil mix.</p>
      
      <h4>Windowsill Gardens</h4>
      <p>South-facing windows provide excellent light for herbs like basil, parsley, and chives.</p>
      
      <h3>Best Plants for Beginners</h3>
      <ol>
        <li><strong>Herbs:</strong> Basil, mint, rosemary, thyme</li>
        <li><strong>Leafy Greens:</strong> Lettuce, spinach, kale, arugula</li>
        <li><strong>Cherry Tomatoes:</strong> Compact varieties perfect for containers</li>
        <li><strong>Radishes:</strong> Quick-growing and space-efficient</li>
      </ol>
      
      <blockquote>
        "In every gardener there is a child who believes in The Seed Fairy." - Robert Brault
      </blockquote>
      
      <h3>Essential Tips for Success</h3>
      <p>Start small, choose the right containers, ensure proper drainage, and be patient. Gardening is a journey of learning and discovery.</p>
    `,
    category: 'Lifestyle',
    tags: ['Urban Gardening', 'Sustainability', 'Health', 'Home Improvement'],
    featuredImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    isPublished: true
  },
  {
    title: 'Digital Photography Basics: Capturing Life\'s Moments',
    content: `
      <h2>From Snapshots to Stunning Images</h2>
      <p>Photography is more accessible than ever, but creating truly compelling images requires understanding fundamental principles and developing your artistic eye.</p>
      
      <h3>Camera Basics: Beyond Auto Mode</h3>
      <h4>The Exposure Triangle</h4>
      <ul>
        <li><strong>Aperture:</strong> Controls depth of field and light intake</li>
        <li><strong>Shutter Speed:</strong> Determines motion blur and exposure time</li>
        <li><strong>ISO:</strong> Affects image brightness and noise levels</li>
      </ul>
      
      <h3>Composition Techniques</h3>
      <h4>Rule of Thirds</h4>
      <p>Place important elements along imaginary grid lines for more dynamic compositions.</p>
      
      <h4>Leading Lines</h4>
      <p>Use natural or architectural lines to guide the viewer's eye through your image.</p>
      
      <h4>Frame Within a Frame</h4>
      <p>Use doorways, windows, or natural elements to create depth and focus.</p>
      
      <h3>Lighting: The Heart of Photography</h3>
      <p>Understanding light is crucial for great photography:</p>
      <ul>
        <li><strong>Golden Hour:</strong> Soft, warm light just after sunrise or before sunset</li>
        <li><strong>Blue Hour:</strong> Even, soft light just after sunset</li>
        <li><strong>Harsh Light:</strong> Can create dramatic shadows and contrast</li>
      </ul>
      
      <h3>Essential Equipment for Beginners</h3>
      <ol>
        <li>DSLR or mirrorless camera with kit lens</li>
        <li>Sturdy tripod for stability</li>
        <li>Extra batteries and memory cards</li>
        <li>Lens cleaning kit</li>
        <li>Camera bag for protection</li>
      </ol>
      
      <blockquote>
        "Photography is the story I fail to put into words." - Destin Sparks
      </blockquote>
      
      <h3>Post-Processing Basics</h3>
      <p>Learn basic editing techniques to enhance your images. Start with simple adjustments to exposure, contrast, and color balance.</p>
    `,
    category: 'Technology',
    tags: ['Photography', 'Digital Art', 'Creative', 'Tutorial'],
    featuredImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    isPublished: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogplatform');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create blogs with random authors and generate slugs
    const blogsWithAuthors = sampleBlogs.map((blog, index) => ({
      ...blog,
      author: users[index % users.length]._id,
      slug: blog.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        + '-' + (Date.now() + index) // Add index to ensure uniqueness
    }));

    const blogs = await Blog.create(blogsWithAuthors);
    console.log(`Created ${blogs.length} blogs`);

    // Add some likes to blogs
    for (let i = 0; i < blogs.length; i++) {
      const randomLikes = Math.floor(Math.random() * 50) + 5;
      const randomViews = Math.floor(Math.random() * 1000) + 100;
      
      blogs[i].views = randomViews;
      
      // Add random likes from different users
      const likeUsers = users.slice(0, Math.min(randomLikes, users.length));
      blogs[i].likes = likeUsers.map(user => ({
        user: user._id,
        likedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }));
      
      await blogs[i].save();
    }

    console.log('Added likes and views to blogs');
    console.log('Database seeded successfully!');
    
    console.log('\n=== Sample Login Credentials ===');
    console.log('Regular Users:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');
    console.log('Email: mike@example.com | Password: password123');
    console.log('\nAdmin User:');
    console.log('Email: admin@example.com | Password: admin123');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();