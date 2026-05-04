'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type UseLoadMoreProps = {
  currentCount: number;
  limit?: number;
  offset?: number;
  totalLength: number;
};

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timer: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const useLoadMore = ({ currentCount, limit = 4, offset = 1000, totalLength }: UseLoadMoreProps) => {
  const router = useRouter();
  const lenis = useLenis();

  const pathName = usePathname();

  const newPath = pathName.replace(/^\/en/, '');

  const queryParams = useSearchParams();

  const initialLimit = Number(queryParams.get('loadMore')) || limit;

  const category = queryParams.get('category') || ''; // Get current category from query

  const [loadMoreQuery, setLoadMoreQuery] = useState<number>(initialLimit);

  const [hasMore, setHasMore] = useState<boolean>(true);

  // Function to increase the limit
  const loadMore = useCallback(() => {
    const newLimit = loadMoreQuery + limit;

    if (currentCount >= totalLength) {
      setHasMore(false); // Stop loading if we've reached the end
    } else {
      setLoadMoreQuery(newLimit);

      // Get current query params and add new loadMore parameter
      const params = new URLSearchParams(queryParams.toString());

      params.set('loadMore', newLimit.toString());

      // Update URL with all parameters, including loadMore
      router.push(`${newPath}?${params.toString()}`, { scroll: false });
    }
  }, [loadMoreQuery, limit, totalLength, currentCount, newPath, queryParams, router]);

  // Handle scroll with offset (check window availability)
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined' || !lenis) return; // Check if code is running in browser

    const scrollTop = lenis.scroll || 0;
    const viewportHeight = window.innerHeight;
    const documentHeight = lenis.limit || document.documentElement.scrollHeight;

    // Check with offset consideration
    if (scrollTop + viewportHeight + offset >= documentHeight && hasMore) {
      loadMore();
    }
  }, [hasMore, loadMore, offset, lenis]);

  // Debounced scroll handler
  const debouncedHandleScroll = useCallback(debounce(handleScroll, 300), [handleScroll]);

  // Scroll event handler
  useEffect(() => {
    if (typeof window === 'undefined' || !lenis) return; // Check if code is running in browser

    // Use Lenis to track scroll
    const unsubscribe = lenis.on('scroll', debouncedHandleScroll);

    return () => {
      unsubscribe();
    };
  }, [debouncedHandleScroll, lenis]);

  // Reset limit when category changes (query parameters)
  useEffect(() => {
    setLoadMoreQuery(initialLimit); // Reset limit to initial
    setHasMore(true); // Allow more loading
  }, [category, initialLimit]);

  return { hasMore, loadMoreQuery };
};

export default useLoadMore;
