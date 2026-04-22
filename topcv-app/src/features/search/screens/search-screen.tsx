import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { AppText } from '@/src/components/ui/app-text';
import { SearchFilterBar } from '@/src/features/search/components/search-filter-bar';
import { SearchJobCard } from '@/src/features/search/components/search-job-card';
import { KeywordList } from '@/src/features/search/components/keyword-list';
import { SearchTopBar } from '@/src/features/search/components/search-top-bar';
import {
  jobLevelOptions,
  jobTypeOptions,
  locationOptions,
  popularKeywords,
} from '@/src/features/search/data';
import { searchPublicJobs } from '@/src/features/search/services/search-api';
import type {
  SearchJobCardItem,
  SearchJobLevel,
  SearchLocation,
  SearchJobType,
  SearchOption,
} from '@/src/features/search/types';
import { mapSearchJobToCard } from '@/src/features/search/utils/search-job-mapper';
import { useFavorites } from '@/src/features/favorites/hooks/use-favorites';
import { getLatestHomeJobs } from '@/src/features/home/services/home-api';
import { mapHomeJobToCard } from '@/src/features/home/utils/job-card-mapper';
import { ApiError } from '@/src/lib/api/api-error';
import { colors, radius, spacing } from '@/src/theme';

const SEARCH_PAGE_SIZE = 10;
const SUGGESTION_LIMIT = 6;

type SearchFilterKey = 'location' | 'job_type' | 'level';

function getCurrentOption<TValue extends string>(
  options: SearchOption<TValue>[],
  currentValue?: TValue
) {
  return options.find((item) => item.value === currentValue) ?? options[0];
}

export function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    source?: string;
    query?: string;
  }>();
  const initialQuery = typeof params.query === 'string' ? params.query : '';
  const shouldAutoSearch = initialQuery.trim().length >= 2 || params.mode === 'results';

  const [query, setQuery] = useState(initialQuery);
  const [appliedQuery, setAppliedQuery] = useState(shouldAutoSearch ? initialQuery.trim() : '');
  const [hasSearched, setHasSearched] = useState(shouldAutoSearch);
  const [page, setPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<SearchLocation>();
  const [selectedJobType, setSelectedJobType] = useState<SearchJobType>();
  const [selectedLevel, setSelectedLevel] = useState<SearchJobLevel>();
  const [openFilterKey, setOpenFilterKey] = useState<SearchFilterKey | null>(null);
  const [suggestedJobs, setSuggestedJobs] = useState<SearchJobCardItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState<string>();
  const [searchResults, setSearchResults] = useState<SearchJobCardItem[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [searchError, setSearchError] = useState<string>();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: SEARCH_PAGE_SIZE,
    total: 0,
    total_pages: 0,
  });
  const { isFavorited } = useFavorites();

  const showResults = hasSearched && appliedQuery.trim().length >= 2;
  const activeFilterCount =
    Number(Boolean(selectedLocation)) +
    Number(Boolean(selectedJobType)) +
    Number(Boolean(selectedLevel));
  const currentLocationOption = getCurrentOption(locationOptions, selectedLocation);
  const currentJobTypeOption = getCurrentOption(jobTypeOptions, selectedJobType);
  const currentJobLevelOption = getCurrentOption(jobLevelOptions, selectedLevel);

  useEffect(() => {
    let isMounted = true;

    const loadSuggestedJobs = async () => {
      try {
        setIsLoadingSuggestions(true);
        setSuggestionsError(undefined);
        const response = await getLatestHomeJobs(SUGGESTION_LIMIT);

        if (!isMounted) {
          return;
        }

        setSuggestedJobs(response.data.items.map(mapHomeJobToCard));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setSuggestionsError(error.message);
        } else {
          setSuggestionsError('Không thể tải gợi ý việc làm');
        }

        setSuggestedJobs([]);
      } finally {
        if (isMounted) {
          setIsLoadingSuggestions(false);
        }
      }
    };

    void loadSuggestedJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showResults) {
      setSearchResults([]);
      setSearchError(undefined);
      setPagination((current) => ({ ...current, page: 1, total: 0, total_pages: 0 }));
      return;
    }

    let isMounted = true;

    const loadSearchResults = async () => {
      try {
        setIsLoadingResults(true);
        setSearchError(undefined);

        const response = await searchPublicJobs({
          q: appliedQuery,
          location: selectedLocation,
          job_type: selectedJobType,
          level: selectedLevel,
          page,
          limit: SEARCH_PAGE_SIZE,
        });

        if (!isMounted) {
          return;
        }

        setSearchResults(response.data.items.map(mapSearchJobToCard));
        setPagination(response.data.pagination);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          setSearchError(error.message);
        } else {
          setSearchError('Không thể tải kết quả tìm kiếm');
        }

        setSearchResults([]);
        setPagination((current) => ({ ...current, total: 0, total_pages: 0 }));
      } finally {
        if (isMounted) {
          setIsLoadingResults(false);
        }
      }
    };

    void loadSearchResults();

    return () => {
      isMounted = false;
    };
  }, [appliedQuery, page, selectedJobType, selectedLevel, selectedLocation, showResults]);

  const handleSearch = () => {
    const nextQuery = query.trim();

    if (!nextQuery) {
      setHasSearched(false);
      setAppliedQuery('');
      setSearchError(undefined);
      setOpenFilterKey(null);
      setPage(1);
      return;
    }

    if (nextQuery.length < 2) {
      setHasSearched(true);
      setAppliedQuery('');
      setSearchResults([]);
      setPagination((current) => ({ ...current, page: 1, total: 0, total_pages: 0 }));
      setSearchError('Từ khóa cần ít nhất 2 ký tự');
      setOpenFilterKey(null);
      setPage(1);
      return;
    }

    setHasSearched(true);
    setAppliedQuery(nextQuery);
    setSearchError(undefined);
    setOpenFilterKey(null);
    setPage(1);
  };

  const handleKeywordSelect = (value: string) => {
    setQuery(value);
    setAppliedQuery(value);
    setHasSearched(true);
    setSearchError(undefined);
    setOpenFilterKey(null);
    setPage(1);
  };

  const handleChangeText = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setHasSearched(false);
      setAppliedQuery('');
      setSearchError(undefined);
      setOpenFilterKey(null);
      setPage(1);
    }
  };

  const clearFilters = () => {
    setSelectedLocation(undefined);
    setSelectedJobType(undefined);
    setSelectedLevel(undefined);
    setOpenFilterKey(null);
    setPage(1);
  };

  const handleFilterToggle = (filterKey: SearchFilterKey) => {
    setOpenFilterKey((current) => (current === filterKey ? null : filterKey));
  };

  const handleLocationSelect = (value?: SearchLocation) => {
    setSelectedLocation(value);
    setOpenFilterKey(null);
    setPage(1);
  };

  const handleJobTypeSelect = (value?: SearchJobType) => {
    setSelectedJobType(value);
    setOpenFilterKey(null);
    setPage(1);
  };

  const handleLevelSelect = (value?: SearchJobLevel) => {
    setSelectedLevel(value);
    setOpenFilterKey(null);
    setPage(1);
  };

  const filterItems = [
    {
      key: 'filter',
      label: activeFilterCount > 0 ? `${activeFilterCount}` : undefined,
      active: activeFilterCount > 0,
      onPress: clearFilters,
    },
    {
      key: 'location',
      label: currentLocationOption.label,
      active: Boolean(selectedLocation),
      open: openFilterKey === 'location',
      onPress: () => handleFilterToggle('location'),
    },
    {
      key: 'job_type',
      label: currentJobTypeOption.label,
      active: Boolean(selectedJobType),
      open: openFilterKey === 'job_type',
      onPress: () => handleFilterToggle('job_type'),
    },
    {
      key: 'level',
      label: currentJobLevelOption.label,
      active: Boolean(selectedLevel),
      open: openFilterKey === 'level',
      onPress: () => handleFilterToggle('level'),
    },
  ] as const;

  const suggestionLabel = useMemo(() => {
    if (isLoadingSuggestions) {
      return 'Đang tải gợi ý việc làm...';
    }

    if (suggestionsError) {
      return suggestionsError;
    }

    return undefined;
  }, [isLoadingSuggestions, suggestionsError]);

  const resultSummary = useMemo(() => {
    if (searchError) {
      return searchError;
    }

    if (isLoadingResults) {
      return 'Đang tìm việc làm phù hợp...';
    }

    if (pagination.total === 0) {
      return 'Không tìm thấy kết quả phù hợp';
    }

    return `${pagination.total} kết quả`;
  }, [isLoadingResults, pagination.total, searchError]);

  const dropdownOptions =
    openFilterKey === 'location'
      ? locationOptions
      : openFilterKey === 'job_type'
        ? jobTypeOptions
        : openFilterKey === 'level'
          ? jobLevelOptions
          : [];

  const selectedDropdownValue =
    openFilterKey === 'location'
      ? selectedLocation
      : openFilterKey === 'job_type'
        ? selectedJobType
        : openFilterKey === 'level'
          ? selectedLevel
          : undefined;

  const handleDropdownSelect = (value?: string) => {
    if (openFilterKey === 'location') {
      handleLocationSelect(value as SearchLocation | undefined);
      return;
    }

    if (openFilterKey === 'job_type') {
      handleJobTypeSelect(value as SearchJobType | undefined);
      return;
    }

    if (openFilterKey === 'level') {
      handleLevelSelect(value as SearchJobLevel | undefined);
    }
  };

  return (
    <View style={styles.screen}>
      <SearchTopBar
        query={query}
        onChangeText={handleChangeText}
        onBackPress={() => router.back()}
        onSubmit={handleSearch}
        searched={showResults}
        autoFocus={!shouldAutoSearch}
        locationLabel={currentLocationOption.label}
      />

      {showResults ? (
        <>
          <View style={styles.filtersWrap}>
            <SearchFilterBar filters={filterItems} />
          </View>

          {openFilterKey ? (
            <>
              <Pressable style={styles.dropdownBackdrop} onPress={() => setOpenFilterKey(null)} />
              <View style={styles.dropdownWrap}>
                <View style={styles.dropdownCard}>
                  {dropdownOptions.map((option) => {
                    const isSelected =
                      option.value === selectedDropdownValue ||
                      (!option.value && !selectedDropdownValue);

                    return (
                      <Pressable
                        key={`${openFilterKey}-${option.label}`}
                        style={({ pressed }) => [
                          styles.dropdownItem,
                          isSelected ? styles.dropdownItemSelected : null,
                          pressed ? styles.dropdownItemPressed : null,
                        ]}
                        onPress={() => handleDropdownSelect(option.value)}>
                        <AppText
                          variant="bodyStrong"
                          color={isSelected ? colors.primaryDark : colors.text}>
                          {option.label}
                        </AppText>
                        {isSelected ? (
                          <Feather name="check" size={18} color={colors.primary} />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </>
          ) : null}

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.resultsHead}>
              <AppText variant="bodyStrong" color={searchError ? colors.tertiary : colors.primary}>
                {resultSummary}
              </AppText>
              <Pressable style={styles.alertButton} onPress={clearFilters}>
                <Feather name="refresh-cw" size={16} color={colors.primary} />
                <AppText variant="bodyStrong" color={colors.primary}>
                  Xóa lọc
                </AppText>
              </Pressable>
            </View>

            {!isLoadingResults && searchResults.length > 0 ? (
              <View style={styles.jobList}>
                {searchResults.map((job) => (
                  <SearchJobCard
                    key={job.id}
                    {...job}
                    favorite={isFavorited(job.id)}
                    onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
                  />
                ))}
              </View>
            ) : null}

            {!isLoadingResults && !searchError && searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="search" size={20} color="#9AA6A0" />
                <AppText variant="body" color={colors.textMuted} style={styles.emptyCopy}>
                  Thử đổi từ khóa hoặc đổi bộ lọc để tìm thêm việc làm.
                </AppText>
              </View>
            ) : null}

            {pagination.total_pages > 1 ? (
              <View style={styles.paginationWrap}>
                <Pressable
                  style={({ pressed }) => [
                    styles.pageButton,
                    page <= 1 ? styles.pageButtonDisabled : null,
                    pressed && page > 1 ? styles.pageButtonPressed : null,
                  ]}
                  onPress={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}>
                  <Feather
                    name="chevron-left"
                    size={18}
                    color={page <= 1 ? '#A9B4AD' : colors.primaryDark}
                  />
                  <AppText
                    variant="bodyStrong"
                    color={page <= 1 ? '#A9B4AD' : colors.primaryDark}>
                    Trang trước
                  </AppText>
                </Pressable>

                <AppText variant="bodyStrong" color={colors.textMuted}>
                  Trang {pagination.page}/{pagination.total_pages}
                </AppText>

                <Pressable
                  style={({ pressed }) => [
                    styles.pageButton,
                    page >= pagination.total_pages ? styles.pageButtonDisabled : null,
                    pressed && page < pagination.total_pages ? styles.pageButtonPressed : null,
                  ]}
                  onPress={() =>
                    setPage((current) => Math.min(pagination.total_pages, current + 1))
                  }
                  disabled={page >= pagination.total_pages}>
                  <AppText
                    variant="bodyStrong"
                    color={page >= pagination.total_pages ? '#A9B4AD' : colors.primaryDark}>
                    Trang sau
                  </AppText>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={page >= pagination.total_pages ? '#A9B4AD' : colors.primaryDark}
                  />
                </Pressable>
              </View>
            ) : null}
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

            {suggestionLabel ? (
              <AppText
                variant="body"
                color={suggestionsError ? colors.tertiary : colors.textMuted}>
                {suggestionLabel}
              </AppText>
            ) : null}

            <View style={styles.jobList}>
              {suggestedJobs.map((job) => (
                <SearchJobCard
                  key={job.id}
                  {...job}
                  favorite={isFavorited(job.id)}
                  onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
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
    backgroundColor: colors.surface,
    zIndex: 20,
  },
  dropdownBackdrop: {
    ...StyleSheet.absoluteFillObject,
    top: 122,
    backgroundColor: 'rgba(15, 18, 15, 0.06)',
    zIndex: 10,
  },
  dropdownWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    zIndex: 30,
  },
  dropdownCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#DCE6DD',
    paddingVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  dropdownItem: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dropdownItemSelected: {
    backgroundColor: '#EEFBEF',
  },
  dropdownItemPressed: {
    opacity: 0.9,
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
  emptyState: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E4EAE4',
    backgroundColor: '#FAFCFA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyCopy: {
    textAlign: 'center',
  },
  paginationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  pageButton: {
    minHeight: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CFE4D3',
    backgroundColor: '#F5FBF5',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageButtonDisabled: {
    borderColor: '#E1E7E2',
    backgroundColor: '#F7F8F7',
  },
  pageButtonPressed: {
    opacity: 0.9,
  },
});
