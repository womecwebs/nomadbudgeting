import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for Numbeo Data with Smart Cache
  app.get("/api/budget/:country/:city", async (req, res) => {
    const { country, city } = req.params;
    const apiKey = process.env.RAPIDAPI_KEY;
    const cityName = city.toLowerCase();

    // Step A: Query Supabase
    const isSupabaseConfigured = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;

    if (isSupabaseConfigured) {
      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from("city_costs")
          .select("*")
          .eq("city_name", cityName)
          .single();

        if (cachedData) {
          const lastUpdated = new Date(cachedData.last_updated);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          if (lastUpdated > thirtyDaysAgo) {
            return res.json(cachedData);
          }
        }
      } catch (err) {
        console.error("Cache check failed:", err);
      }
    } else {
      console.warn("Supabase not configured. Skipping cache check.");
    }

    // Step B: Fetch from RapidAPI if missing or old
    if (!apiKey) {
      console.warn("RAPIDAPI_KEY is not configured. Returning fallback data.");
      return res.json({
        city_name: cityName,
        country: country,
        currency: "USD",
        budget_data: {
          budget: { name: 'Budget', description: 'Hostels and street food', dailyTotal: 60, breakdown: { food: 20, accommodation: 25, transport: 10, entertainment: 5 } },
          midRange: { name: 'Mid-range', description: 'Boutique stays and casual dining', dailyTotal: 150, breakdown: { food: 45, accommodation: 70, transport: 20, entertainment: 15 } },
          luxury: { name: 'Luxury', description: '5-star luxury and fine dining', dailyTotal: 450, breakdown: { food: 120, accommodation: 250, transport: 50, entertainment: 30 } }
        },
        daily_total: 150,
        last_updated: new Date().toISOString(),
        warning: "API Key not configured. Using global averages."
      });
    }

    try {
      const response = await axios.get("https://numbeo-cost-of-living-v1.p.rapidapi.com/city_prices", {
        params: { city, country },
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "numbeo-cost-of-living-v1.p.rapidapi.com",
        },
        timeout: 8000,
      });

      if (!response.data || !response.data.prices || response.data.prices.length === 0) {
        throw new Error("No data found for this city");
      }

      const prices = response.data.prices;
      const getPrice = (name: string) => prices.find((p: any) => p.item_name.includes(name))?.average_price || 0;

      const meal = getPrice("Meal, Inexpensive Restaurant") || 15;
      const beer = getPrice("Domestic Beer") || 5;
      const taxi = getPrice("Taxi Start") || 3.5;
      const hotel = getPrice("Average Hotel Price") || 100;

      // Calculate Personas
      const calculatePersona = (multiplier: number, name: string, desc: string) => {
        const food = Math.round(meal * multiplier);
        const accommodation = Math.round(hotel * (multiplier / 2));
        const transport = Math.round(taxi * multiplier * 2);
        const entertainment = Math.round(beer * multiplier * 3);
        return {
          name,
          description: desc,
          dailyTotal: food + accommodation + transport + entertainment,
          breakdown: { food, accommodation, transport, entertainment }
        };
      };

      const budgetData = {
        budget: calculatePersona(1.5, "Budget", "Hostels and street food"),
        midRange: calculatePersona(3, "Mid-range", "Boutique stays and casual dining"),
        luxury: calculatePersona(6, "Luxury", "5-star luxury and fine dining")
      };

      const newRecord = {
        city_name: cityName,
        country: country,
        currency: response.data.currency || "USD",
        budget_data: budgetData,
        daily_total: budgetData.midRange.dailyTotal,
        last_updated: new Date().toISOString()
      };

      // Step C: Save to Supabase
      if (isSupabaseConfigured) {
        try {
          await supabase.from("city_costs").upsert(newRecord, { onConflict: "city_name" });
        } catch (err) {
          console.error("Failed to save to Supabase:", err);
        }
      }

      res.json(newRecord);
    } catch (error: any) {
      console.error("RapidAPI Error:", error.message);
      
      const status = error.response?.status;
      let warning = "Failed to fetch real-time data. Using global averages.";
      
      if (status === 404) {
        warning = `City "${city}" not found in our database. Showing global averages.`;
      } else if (status === 429) {
        warning = "API rate limit exceeded. Showing global averages.";
      }

      const fallbackRecord = {
        city_name: cityName,
        country: country,
        currency: "USD",
        budget_data: {
          budget: { name: 'Budget', description: 'Hostels and street food', dailyTotal: 60, breakdown: { food: 20, accommodation: 25, transport: 10, entertainment: 5 } },
          midRange: { name: 'Mid-range', description: 'Boutique stays and casual dining', dailyTotal: 150, breakdown: { food: 45, accommodation: 70, transport: 20, entertainment: 15 } },
          luxury: { name: 'Luxury', description: '5-star luxury and fine dining', dailyTotal: 450, breakdown: { food: 120, accommodation: 250, transport: 50, entertainment: 30 } }
        },
        daily_total: 150,
        last_updated: new Date().toISOString(),
        warning: warning
      };

      res.json(fallbackRecord);
    }
  });

  // Viator Integration API
  app.get("/api/tours/:city", async (req, res) => {
    const { city } = req.params;
    const viatorKey = process.env.VIATOR_KEY;
    const affiliateParams = "pid=P00218939&mcid=42383&medium=link";

    const fallbackTours = [
      {
        title: `Best of ${city} Walking Tour`,
        image: `https://picsum.photos/seed/${city}1/400/300`,
        price: "From $45",
        rating: 4.8,
        url: `https://www.viator.com/search/${city}?${affiliateParams}`
      },
      {
        title: `${city} Food & Culture Experience`,
        image: `https://picsum.photos/seed/${city}2/400/300`,
        price: "From $89",
        rating: 4.9,
        url: `https://www.viator.com/search/${city}?${affiliateParams}`
      },
      {
        title: `Full Day ${city} Highlights`,
        image: `https://picsum.photos/seed/${city}3/400/300`,
        price: "From $120",
        rating: 4.7,
        url: `https://www.viator.com/search/${city}?${affiliateParams}`
      }
    ];

    if (!viatorKey) {
      console.warn("VIATOR_KEY not configured. Returning fallback tours.");
      return res.json(fallbackTours);
    }

    try {
      const response = await axios.post(
        "https://api.viator.com/partner/products/search",
        {
          searchTerm: city,
          pagination: {
            start: 1,
            count: 3,
          },
          currency: "USD",
        },
        {
          headers: {
            "exp-api-key": viatorKey,
            "Accept-Language": "en-US",
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      if (response.data && response.data.products && response.data.products.length > 0) {
        const tours = response.data.products.map((p: any) => ({
          title: p.title,
          image: p.images?.[0]?.variants?.[0]?.url || `https://picsum.photos/seed/${p.productCode}/400/300`,
          price: p.pricing?.summary?.fromPriceFormatted || "Check Price",
          rating: p.reviews?.combinedAverageRating || 4.5,
          url: `${p.productUrl}${p.productUrl.includes('?') ? '&' : '?'}${affiliateParams}`
        }));
        return res.json(tours);
      }
      res.json(fallbackTours);
    } catch (error: any) {
      console.error("Viator API Error:", error.message);
      res.json(fallbackTours);
    }
  });

  // Flight Recommendation API
  app.get("/api/flights/:city", async (req, res) => {
    const { city } = req.params;
    const searchUrl = `https://expedia.com/affiliates/expedia-home.Fv9Dhhf?city=${encodeURIComponent(city)}`;
    
    const flights = [
      {
        title: `Cheapest Flight to ${city}`,
        price: "From $199",
        url: searchUrl
      },
      {
        title: `Direct Routes to ${city}`,
        price: "From $299",
        url: searchUrl
      },
      {
        title: `Premium Deals to ${city}`,
        price: "From $599",
        url: searchUrl
      }
    ];
    res.json(flights);
  });

  // Hotel Recommendation API
  app.get("/api/hotels/:city", async (req, res) => {
    const { city } = req.params;
    const hotelUrl = "https://expedia.com/affiliates/expedia-home.B1FZQho";
    
    const hotels = [
      {
        name: `Top Rated Stay in ${city}`,
        image: `https://picsum.photos/seed/${city}hotel1/400/300`,
        price: "From $85/night",
        rating: 4.5,
        url: hotelUrl
      },
      {
        name: `Luxury Retreat ${city}`,
        image: `https://picsum.photos/seed/${city}hotel2/400/300`,
        price: "From $250/night",
        rating: 4.9,
        url: hotelUrl
      },
      {
        name: `Boutique Gem in ${city}`,
        image: `https://picsum.photos/seed/${city}hotel3/400/300`,
        price: "From $120/night",
        rating: 4.7,
        url: hotelUrl
      }
    ];
    res.json(hotels);
  });

  // AI Forecast API
  app.post("/api/forecast", async (req, res) => {
    const { city, country } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a travel budget forecast for ${city}, ${country}. 
        Provide the following in JSON format:
        1. "trendData": An array of 12 objects with "month" (Jan-Dec) and "price" (estimated daily cost in USD).
        2. "bestMonth": The cheapest month to visit.
        3. "savingsPercent": How much cheaper it is compared to peak season.
        4. "summary": A 2-3 sentence professional explanation of the price trends.
        5. "tips": 3 bullet points for saving money in this specific city.
        6. "confidence": A percentage (e.g., "92%").`,
        config: {
          responseMimeType: "application/json"
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("Gemini Error:", error.message);
      res.status(500).json({ error: "Failed to generate forecast" });
    }
  });

  // Robots.txt dynamic route
  app.get("/robots.txt", (req, res) => {
    const appUrl = process.env.APP_URL || "https://nomadbudget.netlify.app";
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${appUrl}/sitemap.xml`);
  });

  // Sitemap.xml dynamic route
  app.get("/sitemap.xml", (req, res) => {
    const appUrl = process.env.APP_URL || "https://nomadbudget.netlify.app";
    const date = new Date().toISOString().split('T')[0];
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${appUrl}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${appUrl}/blog</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${appUrl}/about</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${appUrl}/privacy</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${appUrl}/disclaimer</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
  });

  return app;
}

export const appPromise = startServer();
