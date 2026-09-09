'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, CATEGORY_SEEDS } from '@/lib/firestore';
import type { Submission, CategorySlug } from '@/lib/types';
import { CategoryCard } from '@/components/gallery/CategoryCard';
import { Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  // Count approved submissions per category
  const [counts, setCounts] = useState<Partial<Record<CategorySlug, number>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const snap = await getDocs(
          query(collection(db, COLLECTIONS.SUBMISSIONS), where('status', '==', 'approved'))
        );
        const c: Partial<Record<CategorySlug, number>> = {};
        snap.docs.forEach((d) => {
          const cat = (d.data() as Submission).categoryId;
          c[cat] = (c[cat] ?? 0) + 1;
        });
        setCounts(c);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-burgundy dark:text-foreground mb-3 sm:mb-4">
          Competition Categories
        </h1>
        <p className="text-foreground/60 max-w-xl mx-auto text-sm sm:text-base md:text-lg">
          Browse approved entries across all four categories of Ganpati Agman.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-saffron" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORY_SEEDS.map((cat) => (
            <CategoryCard key={cat.id} slug={cat.id} count={counts[cat.id] ?? 0} />
          ))}
        </div>
      )}
    </div>
  );
}
