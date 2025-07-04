
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RatingData {
  id: string;
  technical: number;
  managerial: number;
  projects: number;
  self_introduction: number;
  hr_round: number;
  dressup: number;
  communication: number;
  body_language: number;
  punctuality: number;
  overall_rating: number;
  feedback?: string;
  created_at: string;
}

export function useRatings() {
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRatings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interview_ratings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRatings(data || []);
    } catch (error: any) {
      console.error('Error fetching ratings:', error);
      toast.error('Failed to load your ratings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [user]);

  const getOverallAverage = () => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating.overall_rating, 0) / ratings.length;
  };

  return {
    ratings,
    loading,
    refetch: fetchRatings,
    overallAverage: getOverallAverage(),
    hasRatings: ratings.length > 0
  };
}
