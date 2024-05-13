'use client';
import { useMemo, useState } from 'react';
import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import { Delete, Filter, Search } from 'baseui/icon';
import { Cell, Grid } from 'baseui/layout-grid';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles, overrides } from './domains-page-filters.styles';
import domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import domainsPageFiltersConfig from '../config/domains-page-filters.config';
import getDomainsPageChangedFiltersCount from '../helpers/get-domain-page-changed-filters-count';
import clearDomainsPageFilters from '../helpers/clear-domains-page-filters';

export default function DomainsPageFilters() {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainsPageQueryParamsConfig,
    { pageRerender: false }
  );
  const { cls, theme } = useStyletronClasses(cssStyles);
  const [showFilters, setShowFilters] = useState(false);

  const selectedFiltersCount = useMemo(() => {
    return getDomainsPageChangedFiltersCount(queryParams);
  }, [queryParams]);

  return (
    <section>
      <Grid>
        <Cell span={12}>
          <div className={cls.searchBarContainer}>
            <Input
              overrides={overrides.searchInput}
              size="compact"
              clearable
              startEnhancer={() => <Search size={theme.sizing.scale600} />}
              clearOnEscape
              onChange={(event) => {
                const trimmedSearchText = event.target.value.trim();
                setQueryParams({
                  searchText: trimmedSearchText ? trimmedSearchText : undefined,
                });
              }}
              placeholder="Find cadence domain"
              value={queryParams.searchText}
            />
            <Button
              startEnhancer={<Filter />}
              kind={showFilters ? 'primary' : 'secondary'}
              size="compact"
              onClick={() => setShowFilters((v) => !v)}
            >
              Filters
              {showFilters || selectedFiltersCount > 0
                ? ` (${selectedFiltersCount})`
                : null}
            </Button>
          </div>
          {showFilters && (
            <div className={cls.filtersContainer}>
              {domainsPageFiltersConfig.map((f) => {
                return (
                  <f.renderFilter
                    key={f.id}
                    onChange={(v) => setQueryParams({ [f.id]: v })}
                    value={queryParams[f.id]}
                  />
                );
              })}
              <div className={cls.clearBtnContainer}>
                <Button
                  startEnhancer={<Delete />}
                  kind="tertiary"
                  size="compact"
                  onClick={() => {
                    clearDomainsPageFilters(setQueryParams);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </Cell>
      </Grid>
    </section>
  );
}