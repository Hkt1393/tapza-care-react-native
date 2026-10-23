import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getExampleItems } from '../../services/api';
import type { ExampleItem } from '../../types';
import ExampleScreenView from './view';

const ExampleScreenContainer = (): React.ReactElement => {
  const [items, setItems] = useState<ExampleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextItems = await getExampleItems();
      setItems(nextItems);
      setSelectedId(nextItems[0]?.id ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load sample data.';
      setErrorMessage(message);
      setItems([]);
      setSelectedId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return items;
    }

    return items.filter((item) =>
      item.title.toLowerCase().includes(normalizedTerm) || item.body.toLowerCase().includes(normalizedTerm),
    );
  }, [items, searchTerm]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0] ?? null;

  return (
    <ExampleScreenView
      items={filteredItems}
      selectedItem={selectedItem}
      searchTerm={searchTerm}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onLoadData={loadData}
      onSearchChange={setSearchTerm}
      onSelectItem={(item) => setSelectedId(item.id)}
      onReset={() => {
        setSearchTerm('');
        setSelectedId(null);
        setItems([]);
        setErrorMessage(null);
      }}
    />
  );
};

export default ExampleScreenContainer;
