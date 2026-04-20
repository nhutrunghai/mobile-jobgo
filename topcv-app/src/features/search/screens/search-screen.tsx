import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { bestJobs, suggestedJobs } from '@/src/features/home/data';
import { SearchFilterBar } from '@/src/features/search/components/search-filter-bar';
import { SearchJobCard } from '@/src/features/search/components/search-job-card';
import { KeywordList } from '@/src/features/search/components/keyword-list';
import { SearchTopBar } from '@/src/features/search/components/search-top-bar';
import {
  popularKeywords,
  searchedJobs,
  searchFilters,
  suggestedSearchJobs,
} from '@/src/features/search/data';
import { colors, radius, spacing } from '@/src/theme';

type SearchResultItem = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  image: string;
  highlighted?: boolean;
  favorite?: boolean;
};

export function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    source?: string;
    query?: string;
  }>();

  const initialQuery = typeof params.query === 'string' ? params.query : '';
  const initialShowResults =
    params.mode === 'results' || !!params.source || initialQuery.trim().length > 0;

  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(initialShowResults);

  const showResults = hasSearched || query.trim().length > 0;

  const presetResults = useMemo<SearchResultItem[] | null>(() => {
    if (params.source === 'suggested') {
      return suggestedJobs.map((job, index) => ({
        id: `suggested-${index + 1}`,
        title: job.title,
        company: job.company,
        salary: job.salary,
        location: job.location,
        image: job.image,
        highlighted: job.highlighted,
        favorite: false,
      }));
    }

    if (params.source === 'best') {
      return bestJobs.map((job, index) => ({
        id: `best-${index + 1}`,
        title: job.title,
        company: job.company,
        salary: job.salary,
        location: job.location,
        image: job.image,
        highlighted: job.highlighted,
        favorite: false,
      }));
    }

    return null;
  }, [params.source]);

  const jobResults = useMemo(() => {
    if (showResults) {
      return presetResults ?? searchedJobs;
    }

    return suggestedSearchJobs;
  }, [presetResults, showResults]);

  const handleKeywordSelect = (value: string) => {
    setQuery(value);
    setHasSearched(true);
  };

  const handleChangeText = (value: string) => {
    setQuery(value);
    if (!value.trim() && !params.source) {
      setHasSearched(false);
    } else if (value.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <View style={styles.screen}>
      <SearchTopBar
        query={query}
        onChangeText={handleChangeText}
        onBackPress={() => router.back()}
        searched={showResults}
        autoFocus={!initialShowResults}
      />

      {showResults ? (
        <>
          <View style={styles.filtersWrap}>
            <SearchFilterBar filters={searchFilters} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.resultsHead}>
              <AppText variant="bodyStrong" color={colors.primary}>
                {jobResults.length} kết quả
              </AppText>
              <Pressable style={styles.alertButton}>
                <Feather name="bell" size={16} color={colors.primary} />
                <AppText variant="bodyStrong" color={colors.primary}>
                  Tạo thông báo việc làm
                </AppText>
              </Pressable>
            </View>

            <View style={styles.jobList}>
              {jobResults.map((job) => (
                <SearchJobCard
                  key={job.id}
                  {...job}
                  onPress={() =>
                    router.push({ pathname: '/job/[id]', params: { id: 'chief-accountant' } })
                  }
                />
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.defaultContent}
          showsVerticalScrollIndicator={false}>
          <KeywordList keywords={popularKeywords} onSelect={handleKeywordSelect} />

          <View style={styles.suggestedSection}>
            <AppText variant="heading" style={styles.sectionTitle}>
              Gợi ý việc làm phù hợp
            </AppText>

            <View style={styles.jobList}>
              {jobResults.map((job) => (
                <SearchJobCard
                  key={job.id}
                  {...job}
                  onPress={() =>
                    router.push({ pathname: '/job/[id]', params: { id: 'chief-accountant' } })
                  }
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  defaultContent: {
    paddingBottom: spacing.xxxl,
  },
  filtersWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1EE',
  },
  resultsContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  resultsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  alertButton: {
    minHeight: 34,
    borderRadius: radius.pill,
    backgroundColor: '#F5FBF5',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobList: {
    gap: spacing.md,
  },
  suggestedSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    gap: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 28,
  },
});
